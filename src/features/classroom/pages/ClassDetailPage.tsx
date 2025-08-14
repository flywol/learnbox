import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Phone } from 'lucide-react';
import { mockClasses, generateMockStudents } from '../data/mockData';
import StudentCard from '../components/StudentCard';
import StudentDetailModal from '../components/StudentDetailModal';
import type { ClassroomStudent } from '../types/classroom.types';

export default function ClassDetailPage() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState<ClassroomStudent | null>(null);
  const [activeTab, setActiveTab] = useState<'student-list' | 'subject'>('student-list');

  const classData = mockClasses.find(c => c.id === classId);
  const students = classData ? generateMockStudents(classData.id, classData.studentCount) : [];

  if (!classData) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-700">Class not found</h3>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/dashboard/classroom');
  };

  const handleStudentClick = (student: ClassroomStudent) => {
    setSelectedStudent(student);
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };

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
      <div className="flex space-x-1">
        <button
          onClick={() => setActiveTab('student-list')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'student-list'
              ? 'border-b-2 border-orange-500 text-orange-500'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Student list
        </button>
        <button
          onClick={() => setActiveTab('subject')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'subject'
              ? 'border-b-2 border-orange-500 text-orange-500'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Subject
        </button>
      </div>

      {/* Student Grid */}
      {activeTab === 'student-list' && (
        <div className="bg-white rounded-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onClick={() => handleStudentClick(student)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Subject Tab Content */}
      {activeTab === 'subject' && (
        <div className="bg-white rounded-lg p-6">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Subject Management</h3>
            <p className="text-gray-500">Subject functionality coming soon...</p>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal student={selectedStudent} onClose={closeModal} />
      )}
    </div>
  );
}