import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Phone } from 'lucide-react';
import { userApiClient } from '../../../admin/user-management/api/userApiClient';
import { subjectsApiClient } from '../../../admin/user-management/api/subjectsApiClient';
import StudentCard from '../components/StudentCard';
import StudentDetailModal from '../components/StudentDetailModal';
import AddSubjectView from '../components/AddSubjectView';
import SubjectCard from '../components/SubjectCard';
import SuccessModal from '../../../../common/components/SuccessModal';
import FailureModal from '../../../../common/components/FailureModal';
import type { ClassroomStudent, ClassroomClass } from '../types/classroom.types';

interface Subject {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
}

export default function ClassDetailPage() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState<ClassroomStudent | null>(null);
  const [activeTab, setActiveTab] = useState<'student-list' | 'subject'>('student-list');
  
  // API state
  const [classData, setClassData] = useState<ClassroomClass | null>(null);
  const [students, setStudents] = useState<ClassroomStudent[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [showAddSubjectView, setShowAddSubjectView] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [retryAction, setRetryAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    const fetchClassData = async () => {
      if (!classId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch class levels to find the specific class
        const classLevels = await userApiClient.getClassLevels();
        
        // Find the class by ID (could be level ID or arm ID)
        let foundClass: ClassroomClass | null = null;
        
        for (const level of classLevels) {
          // Check if classId matches the level ID
          if (level.id === classId) {
            foundClass = {
              id: level.id,
              name: level.class,
              level: level.levelName,
              arm: '',
              teacher: {
                id: 'teacher-placeholder',
                name: 'Not Assigned',
              },
              studentCount: level.studentCount || 0,
              color: 'bg-blue-100 border-blue-200',
            };
            break;
          }
          
          // Check if classId matches any arm ID
          if (level.arms && Array.isArray(level.arms)) {
            for (const arm of level.arms) {
              if (`${level.id}-${arm._id}` === classId) {
                foundClass = {
                  id: classId,
                  name: `${level.class} ${arm.armName}`,
                  level: level.levelName,
                  arm: arm.armName,
                  teacher: {
                    id: arm.assignedTeachers?.[0]?.id || 'teacher-placeholder',
                    name: arm.assignedTeachers?.[0]?.name || 'Not Assigned',
                  },
                  studentCount: arm.studentCount || 0,
                  color: 'bg-blue-100 border-blue-200',
                };
                break;
              }
            }
            if (foundClass) break;
          }
        }

        setClassData(foundClass);

        // Fetch students
        const allStudents = await userApiClient.getStudents();
        // Filter students for this class (simplified - in real implementation, you'd want a specific endpoint)
        const filteredStudents: ClassroomStudent[] = allStudents
          .filter((student: any) => student.role === 'student')
          .slice(0, foundClass?.studentCount || 10) // Limit based on class student count
          .map((student: any) => ({
            id: student.id,
            name: student.fullName,
            admissionNumber: student.admissionNumber || 'N/A',
            email: student.email,
            dateOfBirth: student.dateOfBirth || 'N/A',
            gender: student.gender || 'N/A',
            profilePicture: student.profileImage,
            classLevel: foundClass?.name || 'N/A',
            classArm: foundClass?.arm || 'A',
            session: '2024/2025',
            term: '1st',
            parentName: student.parentName || 'N/A',
            parentContact: student.phoneNumber || 'N/A',
          }));

        setStudents(filteredStudents);

        // Fetch subjects for this class if we have the class level ID
        if (foundClass) {
          try {
            const [levelId, armId] = foundClass.id.split('-'); // Extract level ID and arm ID
            const classSubjects = await subjectsApiClient.getSubjectsForClass(levelId, armId);
            
            const transformedSubjects: Subject[] = classSubjects.map((subject: any, index: number) => ({
              id: subject.id,
              name: subject.name,
              icon: `/assets/${subject.name.toLowerCase().replace(/\s+/g, '')}.svg`,
              bgColor: ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'][index % 4],
            }));
            
            setSubjects(transformedSubjects);
          } catch (subjectError) {
            console.log('No subjects found for this class, keeping empty array');
            setSubjects([]);
          }
        }

      } catch (err) {
        console.error('Failed to fetch class data:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(`Failed to load class data: ${errorMessage}`);
        setShowFailureModal(true);
        setRetryAction(() => fetchClassData);
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classId]);

  const handleRetry = () => {
    setShowFailureModal(false);
    setError(null);
    if (retryAction) {
      retryAction();
    }
  };

  const handleFailureModalClose = () => {
    setShowFailureModal(false);
    setRetryAction(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <p className="text-gray-500 ml-3">Loading class data...</p>
      </div>
    );
  }

  if (error && !showFailureModal) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Class</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry
          </button>
          <p className="text-xs text-gray-400">
            Or go back to classroom overview
          </p>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-700">Class not found</h3>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/classroom');
  };

  const handleStudentClick = (student: ClassroomStudent) => {
    setSelectedStudent(student);
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };

  const handleAddSubject = () => {
    setShowAddSubjectView(true);
  };

  const handleBackFromAddSubject = () => {
    setShowAddSubjectView(false);
  };

  const handleAddSubjects = (newSubjects: Subject[]) => {
    setSubjects(prev => [...prev, ...newSubjects]);
  };

  const handleShowSuccess = () => {
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setShowAddSubjectView(false);
  };

  const handleSubjectClick = (subject: Subject) => {
    navigate(`/classroom/${classId}/subject/${subject.id}`);
  };

  // Show Add Subject View
  if (showAddSubjectView && classData) {
    return (
      <AddSubjectView
        classId={classData.id.split('-')[0]}
        classArmId={classData.id.split('-')[1]}
        onBack={handleBackFromAddSubject}
        onAddSubjects={handleAddSubjects}
        onShowSuccess={handleShowSuccess}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-semibold">{classData.name}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>A</option>
          </select>
        </div>
      </div>

      {/* Teacher Info */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div>
            <p className="text-sm text-gray-600">Class teacher:</p>
            <p className="font-medium">{classData.teacher.name}</p>
          </div>
          <div className="ml-auto flex space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MessageSquare className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-between items-center border-b border-gray-200">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('student-list')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'student-list'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-700 hover:text-orange-500'
            }`}
          >
            Student list
          </button>
          <button
            onClick={() => setActiveTab('subject')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'subject'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-700 hover:text-orange-500'
            }`}
          >
            Subject
          </button>
        </div>
        
        {/* Add Subject Button - only show on subject tab */}
        {activeTab === 'subject' && (
          <button 
            onClick={handleAddSubject}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Add subject
          </button>
        )}
      </div>

      {/* Student Grid */}
      {activeTab === 'student-list' && (
        <div className="bg-white rounded-lg p-6">
          {students.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Enrolled</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                This class doesn't have any students yet. Students will appear here once they are enrolled in the class.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/user-management/create/student')}
                  className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Student
                </button>
                <p className="text-xs text-gray-400">
                  You can add students through User Management
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {students.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onClick={() => handleStudentClick(student)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subject Tab Content */}
      {activeTab === 'subject' && (
        <div className="bg-white rounded-lg p-6">
          {subjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subjects Added</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                This class doesn't have any subjects configured yet. Add subjects to help organize your class curriculum.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={handleAddSubject}
                  className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Subjects
                </button>
                <p className="text-xs text-gray-400">
                  You can add multiple subjects at once
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onClick={() => handleSubjectClick(subject)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal student={selectedStudent} onClose={closeModal} />
      )}

      {/* Subject Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Success!"
        message="You've successfully added subject to class"
        buttonText="Continue"
      />

      {/* Failure Modal */}
      <FailureModal
        isOpen={showFailureModal}
        onClose={handleFailureModalClose}
        title="Error Loading Class Data"
        message={error || 'Failed to load class information. Please check your connection and try again.'}
        onRetry={handleRetry}
        retryText="Retry Loading"
      />
    </div>
  );
}