import { useState } from 'react';
import Modal from '@/common/components/Modal';
import SuccessModal from '@/common/components/SuccessModal';
import TimetableView from './schedule/TimetableView';
import CalendarView from './schedule/CalendarView';
import AddTimetableForm from './schedule/AddTimetableForm';
import AddEventForm from './schedule/AddEventForm';

interface Subject {
  id: string;
  name: string;
  duration: string;
  color: string;
  icon?: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  type: 'assignment' | 'class' | 'quiz' | 'trip' | 'holiday';
}

export default function ScheduleTab() {
  const [activeSubTab, setActiveSubTab] = useState<'timetable' | 'calendar'>('timetable');
  const [showAddTimetable, setShowAddTimetable] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState('JSS 1');
  const [hasTimetable, setHasTimetable] = useState(false);

  // Mock populated timetable data
  const mockTimetableData: { [key: string]: Subject | null } = {
    'Monday-08:00am': { id: 'math', name: 'Further M...', duration: '1hr 30mins', color: 'bg-blue-100 border-blue-200', icon: '📐' },
    'Tuesday-09:00am': { id: 'biology', name: 'Biology', duration: '50mins', color: 'bg-orange-100 border-orange-200', icon: '🧬' },
    'Wednesday-08:00am': { id: 'biology', name: 'Biology', duration: '50mins', color: 'bg-orange-100 border-orange-200', icon: '🧬' },
    'Wednesday-10:00am': { id: 'chemistry', name: 'Chemistry', duration: '50mins', color: 'bg-yellow-100 border-yellow-200', icon: '⚗️' },
    'Thursday-09:00am': { id: 'math', name: 'Further M...', duration: '1hr', color: 'bg-blue-100 border-blue-200', icon: '📐' },
    'Thursday-12:00pm': { id: 'biology', name: 'Biology', duration: '50mins', color: 'bg-orange-100 border-orange-200', icon: '🧬' },
    'Friday-08:00am': { id: 'chemistry', name: 'Chemistry', duration: '50mins', color: 'bg-yellow-100 border-yellow-200', icon: '⚗️' },
    'Friday-10:00am': { id: 'math', name: 'Further M...', duration: '1hr', color: 'bg-blue-100 border-blue-200', icon: '📐' },
    'Monday-10:00am': { id: 'english', name: 'English', duration: '1hr 30mins', color: 'bg-green-100 border-green-200', icon: '📚' },
    'Tuesday-11:00am': { id: 'math', name: 'Further M...', duration: '1hr', color: 'bg-blue-100 border-blue-200', icon: '📐' },
    'Monday-12:00pm': { id: 'chemistry', name: 'Chemistry', duration: '50mins', color: 'bg-yellow-100 border-yellow-200', icon: '⚗️' },
  };

  // Mock events data
  const mockEvents: Event[] = [
    { id: '1', title: 'Math Assignment Due', date: '2024-01-15', type: 'assignment' },
    { id: '2', title: 'Biology Quiz', date: '2024-01-17', type: 'quiz' },
    { id: '3', title: 'School Trip', date: '2024-01-20', type: 'trip' },
  ];

  const handleAddTimetable = () => {
    setShowAddTimetable(true);
  };

  const handleAddEvent = () => {
    setShowAddEvent(true);
  };

  const handleTimetableSubmit = () => {
    setShowAddTimetable(false);
    setHasTimetable(true);
    setShowSuccessModal(true);
  };

  const handleEventSubmit = () => {
    setShowAddEvent(false);
    setShowSuccessModal(true);
  };

  const handleClassChange = (className: string) => {
    setSelectedClass(className);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs Navigation */}
      <div className="flex space-x-1">
        <button
          onClick={() => setActiveSubTab('timetable')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSubTab === 'timetable'
              ? 'border-b-2 border-orange-500 text-orange-500'
              : 'text-gray-700 hover:text-orange-500'
          }`}
        >
          Timetable
        </button>
        <button
          onClick={() => setActiveSubTab('calendar')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSubTab === 'calendar'
              ? 'border-b-2 border-orange-500 text-orange-500'
              : 'text-gray-700 hover:text-orange-500'
          }`}
        >
          Calendar
        </button>
      </div>

      {/* Tab Content */}
      {activeSubTab === 'timetable' && (
        <TimetableView
          selectedClass={selectedClass}
          hasTimetable={hasTimetable}
          mockTimetableData={mockTimetableData}
          onClassChange={handleClassChange}
          onAddTimetable={handleAddTimetable}
        />
      )}

      {activeSubTab === 'calendar' && (
        <CalendarView
          events={mockEvents}
          onAddEvent={handleAddEvent}
        />
      )}

      {/* Add Timetable Modal */}
      <Modal isOpen={showAddTimetable} onClose={() => setShowAddTimetable(false)}>
        <AddTimetableForm
          onCancel={() => setShowAddTimetable(false)}
          onSubmit={handleTimetableSubmit}
        />
      </Modal>

      {/* Add Event Modal */}
      <Modal isOpen={showAddEvent} onClose={() => setShowAddEvent(false)}>
        <AddEventForm
          onCancel={() => setShowAddEvent(false)}
          onSubmit={handleEventSubmit}
        />
      </Modal>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success!"
        message={showAddTimetable ? "Timetable created successfully!" : "Event added successfully!"}
        buttonText="Continue"
      />
    </div>
  );
}