import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, RefreshCw, AlertCircle, Edit } from 'lucide-react';
import LiveClassTab from '../components/subject-detail/LiveClassTab';
import QuizTab from '../components/subject-detail/QuizTab';
import AssignmentTab from '../components/assignments/AssignmentTab';
import AttendanceTab from '../components/attendance/AttendanceTab';
import { subjectsClassesApiClient } from '../api/subjectsClassesApiClient';
import { lessonsApiClient } from '../../lessons/api/lessonsApiClient';
import { assignmentsApiClient } from '../../assignments/api/assignmentsApiClient';
import type { SubjectDetailTab, Assignment, Quiz } from '../types/classroom.types';
import CourseOverviewCard from '../../../../common/components/CourseOverviewCard';

// Empty state components
const EmptyLessons = ({ onAddLesson }: { onAddLesson: () => void }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h3>
    <p className="text-gray-500 mb-6">Start building your curriculum by creating your first lesson.</p>
    <button
      onClick={onAddLesson}
      className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
    >
      Create First Lesson
    </button>
  </div>
);


const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load data</h3>
    <p className="text-gray-500 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors mx-auto"
    >
      <RefreshCw className="w-4 h-4" />
      <span>Try Again</span>
    </button>
  </div>
);

export default function SubjectDetailPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SubjectDetailTab>('lessons');

  // Fetch subject details and available classes
  const { data: subjectsData, isLoading: subjectsLoading, error: subjectsError } = useQuery({
    queryKey: ['teacher-subjects-classes'],
    queryFn: () => subjectsClassesApiClient.getTeacherSubjectsAndClasses(),
    staleTime: 5 * 60 * 1000,
  });

  const subject = subjectsData?.assignedSubjects.find(s => s._id === subjectId);

  // DEBUG LOGGING
  console.log('=== SUBJECT DETAIL DEBUG ===');
  console.log('subjectId from URL:', subjectId);
  console.log('All subjects:', subjectsData?.assignedSubjects);
  console.log('Found subject:', subject);
  console.log('subject.classRef:', subject?.classRef);
  console.log('typeof subject.classRef:', typeof subject?.classRef);

  // Extract classId and classArmId from subject's classRef
  // classRef can be a string (ID), an object, or null
  const classId = subject?.classRef
    ? typeof subject.classRef === 'object'
      ? subject.classRef._id
      : subject.classRef
    : undefined;
  const classArmId = subject?.classArm;

  console.log('Extracted classId:', classId);
  console.log('Extracted classArmId:', classArmId);
  console.log('=== END DEBUG ===');

  // Fetch lessons for this subject
  const {
    data: lessonsData,
    isLoading: lessonsLoading,
    error: lessonsError,
    refetch: refetchLessons
  } = useQuery({
    queryKey: ['lessons', classId, subjectId, classArmId],
    queryFn: () => {
      if (!classId || !subjectId) {
        throw new Error('Class ID and Subject ID are required');
      }
      return lessonsApiClient.getLessonsByClassAndSubject(classId, subjectId, classArmId);
    },
    enabled: !!classId && !!subjectId,
    staleTime: 5 * 60 * 1000,
  });

  // Mock lesson data - keeping until lessons endpoint is stable
  const mockLessons = [
    { id: '1', number: '1', title: 'Introduction', contentTitle: 'Getting Started' },
    { id: '2', number: '2', title: 'Reproduction in Organisms', contentTitle: 'Chapter 1' },
    { id: '3', number: '3', title: 'Reproduction in Organisms', contentTitle: 'Chapter 2' },
    { id: '4', number: '4', title: 'Introduction', contentTitle: 'Chapter 3' },
    { id: '5', number: '5', title: 'Introduction', contentTitle: 'Chapter 4' },
    { id: '6', number: '6', title: 'Introduction', contentTitle: 'Chapter 5' },
    { id: '7', number: '7', title: 'Introduction', contentTitle: 'Chapter 6' },
    { id: '8', number: '8', title: 'Introduction', contentTitle: 'Chapter 7' },
    { id: '9', number: '9', title: 'Introduction', contentTitle: 'Chapter 8' },
    { id: '10', number: '10', title: 'Introduction', contentTitle: 'Chapter 9' },
  ];

  const lessons = lessonsData?.lessons || mockLessons;

  // Fetch assignments for this subject
  const {
    data: assignmentsData,
    isLoading: assignmentsLoading,
    error: assignmentsError,
  } = useQuery({
    queryKey: ['assignments', 'subject', subjectId],
    queryFn: () => assignmentsApiClient.getAssignmentsBySubject(subjectId!),
    enabled: !!subjectId,
    staleTime: 5 * 60 * 1000,
  });

  // Transform API assignments to UI format with mock data
  const assignments: Assignment[] = useMemo(() => {
    const mockAssignments = [
      {
        id: 'mock-assignment-1',
        title: 'Biology Lab Report',
        dueDate: 'Due in 3 days',
        status: 'active' as const,
      },
      {
        id: 'mock-assignment-2',
        title: 'Cell Structure Diagram',
        dueDate: 'Due in 1 day',
        status: 'overdue' as const,
      },
      {
        id: 'mock-assignment-3',
        title: 'Photosynthesis Essay',
        dueDate: 'Expired',
        status: 'expired' as const,
      }
    ];

    if (!assignmentsData?.data?.assignments) return mockAssignments;

    const apiAssignments = assignmentsData.data.assignments.map(assignment => {
      const now = new Date();
      const dueDateTime = new Date(assignment.dueTime || assignment.dueDate);
      const hoursUntilDue = (dueDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      let status: 'active' | 'overdue' | 'expired';
      let dueText: string;

      if (dueDateTime < now) {
        status = 'expired';
        dueText = 'Expired';
      } else if (hoursUntilDue <= 24) {
        status = 'overdue';
        dueText = `Due in ${Math.ceil(hoursUntilDue)}hrs`;
      } else {
        status = 'active';
        const days = Math.ceil(hoursUntilDue / 24);
        dueText = `Due in ${days}days`;
      }

      return {
        id: assignment._id,
        title: assignment.title,
        dueDate: dueText,
        status,
      };
    });

    return [...mockAssignments, ...apiAssignments];
  }, [assignmentsData]);

  // Mock quiz data - keeping until quiz endpoint is provided
  const quizzes: Quiz[] = useMemo(() => [], []);

  const tabs: { key: SubjectDetailTab; label: string }[] = [
    { key: 'lessons', label: 'Lessons' },
    { key: 'live-class', label: 'Live class' },
    { key: 'quiz', label: 'Quiz' },
    { key: 'assignment', label: 'Assignment' },
    { key: 'assessment', label: 'Assessment' },
    { key: 'students', label: 'Students' }
  ];

  const handleLessonClick = (lessonId: string) => {
    navigate(`/teacher/subject/${subjectId}/lesson/${lessonId}`);
  };

  if (subjectsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (subjectsError || !subject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/teacher/classes')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Subject Not Found</h1>
        </div>
        <ErrorState 
          message="The requested subject could not be found or failed to load." 
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/teacher/classes')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">{subject.name}</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 font-medium transition-colors border-b-2 ${
              activeTab === tab.key
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'lessons' && (
        <div className="space-y-6">
          {/* Course Overview Card */}
          <CourseOverviewCard
            description={
              subject.description ||
              `Explore the fascinating world of ${subject.name}`
            }
            progress={0}
            onEdit={() => {
              // TODO: Implement edit functionality
              console.log('Edit course overview');
            }}
          />

          {/* Add New Lesson Button */}
          <div className="flex justify-end">
            <button 
              onClick={() => navigate(`/teacher/subject/${subjectId}/lesson/add`)}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-sm hover:shadow-md font-medium"
            >
              <span className="text-lg">+</span>
              Add New Lesson
            </button>
          </div>

          {/* Lessons Content */}
          {lessonsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : lessonsError ? (
            <ErrorState
              message="Failed to load lessons. Please try again."
              onRetry={() => refetchLessons()}
            />
          ) : lessons.length === 0 ? (
            <EmptyLessons onAddLesson={() => navigate(`/teacher/subject/${subjectId}/lesson/add`)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson.id)}
                  className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    {/* Numbered Badge */}
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 text-lg font-bold">
                      {lesson.number}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {lesson.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Lesson {lesson.number}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Live Class Tab */}
      {activeTab === 'live-class' && (
        <>
          {!subjectId || !classId ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Missing Data</h3>
              <p className="text-gray-500 mb-2">
                Cannot load live classes: {!subjectId ? 'Subject ID missing' : 'Class ID missing'}
              </p>
              <p className="text-xs text-gray-400 font-mono">
                subjectId: {subjectId || 'undefined'} | classId: {classId || 'undefined'}
              </p>
            </div>
          ) : (
            <LiveClassTab
              subjectId={subjectId}
              classId={classId}
              classArmId={classArmId}
              subjectName={subject?.name || 'Subject'}
              students={[]}
            />
          )}
        </>
      )}
      
      {activeTab === 'quiz' && (
        <QuizTab quizzes={quizzes} />
      )}

      {activeTab === 'assignment' && (
        <div className="space-y-6">
          {/* Create Assignment Button */}
          <div className="flex justify-end">
            <button
              onClick={() => navigate(`/teacher/subject/${subjectId}/assignment/create`)}
              className="inline-flex items-center gap-2 px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
            >
              Create new assignment
            </button>
          </div>

          {/* Assignment List */}
          {assignmentsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : assignmentsError ? (
            <ErrorState
              message="Failed to load assignments. Please try again."
              onRetry={() => window.location.reload()}
            />
          ) : (
            <AssignmentTab assignments={assignments} />
          )}
        </div>
      )}

      {activeTab === 'assessment' && (
        <div className="space-y-6">
          {/* Assessment Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Assessment Overview</h3>
              <button className="px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
                Export
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-6 gap-4 mb-6 text-center">
              <div>
                <p className="text-sm text-gray-600">Attendance: <span className="font-semibold">12</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Assignments: <span className="font-semibold">10</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Quizzes: <span className="font-semibold">10</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-600">C.A Test: <span className="font-semibold">20</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Exam: <span className="font-semibold">60</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total: <span className="font-semibold">100</span></p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Grade: A, B, C, D, E, F</p>
            
            {/* Assessment Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 border border-gray-200 font-medium text-gray-700">Student Name</th>
                    <th className="text-center p-3 border border-gray-200 font-medium text-gray-700">Attendance</th>
                    <th className="text-center p-3 border border-gray-200 font-medium text-gray-700">Assignment</th>
                    <th className="text-center p-3 border border-gray-200 font-medium text-gray-700">Quiz</th>
                    <th className="text-center p-3 border border-gray-200 font-medium text-gray-700">C.A Test</th>
                    <th className="text-center p-3 border border-gray-200 font-medium text-gray-700">Exam</th>
                    <th className="text-center p-3 border border-gray-200 font-medium text-gray-700">Total</th>
                    <th className="text-center p-3 border border-gray-200 font-medium text-gray-700">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Jane Doe', attendance: 11, assignment: 50, quiz: 50, caTest: 50, exam: 50, total: 50, grade: 'A' },
                    { name: 'James Doe', attendance: 12, assignment: 50, quiz: 50, caTest: 50, exam: 50, total: 50, grade: 'B' },
                    { name: 'James Doe', attendance: '--', assignment: '--', quiz: '--', caTest: '--', exam: '--', total: '--', grade: '--' },
                    { name: 'James Doe', attendance: 11, assignment: 50, quiz: 50, caTest: 50, exam: 50, total: 50, grade: 'C' },
                    { name: 'James Doe', attendance: 8, assignment: 50, quiz: 50, caTest: 50, exam: 50, total: 50, grade: 'A' },
                    { name: 'James Doe', attendance: '--', assignment: '--', quiz: '--', caTest: '--', exam: '--', total: '--', grade: '--' },
                    { name: 'James Doe', attendance: 10, assignment: 50, quiz: 50, caTest: 50, exam: 50, total: 50, grade: 'A' },
                    { name: 'James Doe', attendance: '--', assignment: '--', quiz: '--', caTest: '--', exam: '--', total: '--', grade: '--' },
                    { name: 'James Doe', attendance: '--', assignment: '--', quiz: '--', caTest: '--', exam: '--', total: '--', grade: '--' },
                    { name: 'James Doe', attendance: '--', assignment: '--', quiz: '--', caTest: '--', exam: '--', total: '--', grade: '--' },
                    { name: 'James Doe', attendance: '--', assignment: '--', quiz: '--', caTest: '--', exam: '--', total: '--', grade: '--' },
                    { name: 'James Doe', attendance: 11, assignment: 50, quiz: 50, caTest: 50, exam: 50, total: 50, grade: 'B' },
                    { name: 'James Doe', attendance: '--', assignment: '--', quiz: '--', caTest: '--', exam: '--', total: '--', grade: '--' },
                  ].map((student, index) => (
                    <tr key={index}>
                      <td className="p-3 border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="text-center p-3 border border-gray-200 text-gray-700">{student.attendance}</td>
                      <td className="text-center p-3 border border-gray-200 text-gray-700">{student.assignment}</td>
                      <td className="text-center p-3 border border-gray-200 text-gray-700">{student.quiz}</td>
                      <td className="text-center p-3 border border-gray-200 text-gray-700">{student.caTest}</td>
                      <td className="text-center p-3 border border-gray-200 text-gray-700">{student.exam}</td>
                      <td className="text-center p-3 border border-gray-200 text-gray-700">{student.total}</td>
                      <td className="text-center p-3 border border-gray-200">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          student.grade === 'A' ? 'bg-green-100 text-green-800' :
                          student.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                          student.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {student.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              Showing 1 to 15 of 2 entries
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'students' && (
        <AttendanceTab subjectName={subject?.name} />
      )}
    </div>
  );
}