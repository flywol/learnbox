import { X, MessageSquare, Phone } from 'lucide-react';
import type { ClassroomStudent } from '../types/classroom.types';

interface StudentDetailModalProps {
  student: ClassroomStudent;
  onClose: () => void;
}

export default function StudentDetailModal({ student, onClose }: StudentDetailModalProps) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Student Info */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-semibold text-gray-600">
              {student.name.charAt(0)}
            </span>
          </div>
          
          <h2 className="text-xl font-semibold mb-1">{student.name}</h2>
          <p className="text-gray-600">School ID</p>
          
          <div className="flex justify-center space-x-2 mt-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MessageSquare className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Student Details */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Email</span>
            <span className="font-medium">{student.email}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Date of Birth</span>
            <span className="font-medium">{student.dateOfBirth}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Class/Section</span>
            <span className="font-medium">{student.classLevel}/{student.classArm}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Session</span>
            <span className="font-medium">{student.session}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Term</span>
            <span className="font-medium">{student.term}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Gender</span>
            <span className="font-medium">{student.gender}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Parent</span>
            <span className="font-medium">{student.parentName}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Parent's contact</span>
            <div className="flex space-x-2">
              <button className="p-1 hover:bg-gray-100 rounded">
                <MessageSquare className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}