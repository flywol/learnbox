import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getSubjectDetail } from '../data/mockData';
import type { SubjectDetailTab } from '../types/classroom.types';
import CourseOverviewCard from '../../../../common/components/CourseOverviewCard';

export default function SubjectDetailPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SubjectDetailTab>('lessons');

  const subject = getSubjectDetail(subjectId!);

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

  if (!subject) {
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">The requested subject could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/teacher/classes')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {subject.name} | {subject.classLevel}
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.key
                ? 'text-orange-600 border-orange-600'
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
            description={subject.courseOverview.description}
            progress={subject.courseOverview.progress}
            onEdit={() => {
              // TODO: Implement edit functionality
              console.log('Edit course overview');
            }}
          />

          {/* Add New Lesson Button */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
              <span className="text-lg">+</span>
              Add New Lesson
            </button>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subject.lessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => handleLessonClick(lesson.id)}
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-lg">
                    {lesson.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      Lesson {lesson.number}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {lesson.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {activeTab !== 'lessons' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {tabs.find(tab => tab.key === activeTab)?.label} View
          </h3>
          <p className="text-gray-600">
            This tab functionality will be implemented soon.
          </p>
        </div>
      )}
    </div>
  );
}