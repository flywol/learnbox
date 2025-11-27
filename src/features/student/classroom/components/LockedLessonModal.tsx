import { X } from 'lucide-react';
import Modal from '@/common/components/Modal';
import { StudentLesson } from '../types/classroom.types';

interface LockedLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: StudentLesson;
}

export default function LockedLessonModal({ isOpen, onClose, lesson }: LockedLessonModalProps) {
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    const minutesStr = minutes.toString().padStart(2, '0');

    return `${day}/${month}/${year} by ${hours}:${minutesStr}${ampm}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Lesson Locked Pending Start Date
          </h2>

          <div className="space-y-2 mb-8">
            <p className="text-gray-600">
              Lesson Title: <span className="font-bold text-gray-900">{lesson.title}</span>
            </p>

            <p className="text-gray-600">
              Scheduled start date & time: <span className="font-bold text-gray-900">{formatDateTime(lesson.startDate)}</span>
            </p>
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto">
            This lesson is scheduled to become available on <span className="font-medium text-gray-900">{formatDateTime(lesson.startDate)}</span>.
            Until then, it is locked and cannot be accessed.
            <br />
            Please check back when the lesson is scheduled to start.
          </p>

          <button
            onClick={onClose}
            className="bg-[#FF5722] hover:bg-[#F4511E] text-white px-8 py-3 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
          >
            Back to lesson
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Please note: If you have any questions or need assistance, contact your teacher.
          </p>
        </div>
      </div>
    </Modal>
  );
}
