import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Phone } from 'lucide-react';
import { mockClasses, generateMockStudents } from '../data/mockData';
import StudentCard from '../components/StudentCard';
import StudentDetailModal from '../components/StudentDetailModal';
import AddSubjectView from '../components/AddSubjectView';
import SubjectCard from '../components/SubjectCard';
import SuccessModal from '../../../common/components/SuccessModal';
import type { ClassroomStudent } from '../types/classroom.types';

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
  // Mock subject data
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 'biology', name: 'Biology', icon: '/assets/biology.svg', bgColor: 'bg-purple-500' },
    { id: 'maths1', name: 'Further Maths', icon: '/assets/maths.svg', bgColor: 'bg-blue-500' },
    { id: 'english', name: 'English', icon: '/assets/english.svg', bgColor: 'bg-green-500' },
    { id: 'chemistry', name: 'Chemistry', icon: '/assets/chem.svg', bgColor: 'bg-yellow-500' },
    { id: 'biology2', name: 'Biology', icon: '/assets/biology.svg', bgColor: 'bg-purple-500' },
    { id: 'maths2', name: 'Further Maths', icon: '/assets/maths.svg', bgColor: 'bg-blue-500' },
    { id: 'english2', name: 'English', icon: '/assets/english.svg', bgColor: 'bg-green-500' },
  ]);
  const [showAddSubjectView, setShowAddSubjectView] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
  if (showAddSubjectView) {
    return (
      <AddSubjectView
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
          {subjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6">
                <img 
                  src="/assets/subject-empty.svg" 
                  alt="No subjects" 
                  className="w-32 h-32 mx-auto mb-6"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No subject added yet.</h3>
              <p 
                onClick={handleAddSubject}
                className="text-orange-500 cursor-pointer hover:text-orange-600"
              >
                Click here to add subjects.
              </p>
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
    </div>
  );
}