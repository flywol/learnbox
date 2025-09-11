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
  icon: string;
}


export default function ScheduleTab() {
  const [activeSubTab, setActiveSubTab] = useState<'timetable' | 'calendar'>('timetable');
  const [showAddTimetable, setShowAddTimetable] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState('JSS 1');
  const [hasTimetable, setHasTimetable] = useState(true);

  // Mock populated timetable data
  const mockTimetableData: { [key: string]: Subject | null } = {
    'Monday-08:00am': { id: 'math', name: 'Further M...', duration: '1hr 30mins', color: 'bg-blue-100', icon: '/assets/maths.svg' },
    'Tuesday-08:00am': { id: 'english', name: 'English', duration: '1hr 30mins', color: 'bg-green-100', icon: '/assets/english.svg' },
    'Wednesday-08:00am': { id: 'biology', name: 'Biology', duration: '50mins', color: 'bg-orange-100', icon: '/assets/biology.svg' },
    'Friday-08:00am': { id: 'chemistry', name: 'Chemistry', duration: '50mins', color: 'bg-yellow-100', icon: '/assets/chem.svg' },
    
    'Tuesday-09:00am': { id: 'biology', name: 'Biology', duration: '50mins', color: 'bg-orange-100', icon: '/assets/biology.svg' },
    'Thursday-09:00am': { id: 'math', name: 'Further M...', duration: '1hr', color: 'bg-blue-100', icon: '/assets/maths.svg' },
    
    'Monday-10:00am': { id: 'english', name: 'English', duration: '1hr 30mins', color: 'bg-green-100', icon: '/assets/english.svg' },
    'Wednesday-10:00am': { id: 'chemistry', name: 'Chemistry', duration: '50mins', color: 'bg-yellow-100', icon: '/assets/chem.svg' },
    'Friday-10:00am': { id: 'math', name: 'Further M...', duration: '1hr', color: 'bg-blue-100', icon: '/assets/maths.svg' },
    
    'Tuesday-11:00am': { id: 'math', name: 'Further M...', duration: '1hr', color: 'bg-blue-100', icon: '/assets/maths.svg' },
    
    'Monday-12:00pm': { id: 'chemistry', name: 'Chemistry', duration: '50mins', color: 'bg-yellow-100', icon: '/assets/chem.svg' },
    'Wednesday-12:00pm': { id: 'math', name: 'Further M...', duration: '1hr', color: 'bg-blue-100', icon: '/assets/maths.svg' },
    'Friday-12:00pm': { id: 'biology', name: 'Biology', duration: '50mins', color: 'bg-orange-100', icon: '/assets/biology.svg' },
    
    'Tuesday-01:00pm': { id: 'english', name: 'English', duration: '1hr 30mins', color: 'bg-green-100', icon: '/assets/english.svg' },
    'Friday-01:00pm': { id: 'english', name: 'English', duration: '1hr 30mins', color: 'bg-green-100', icon: '/assets/english.svg' },
    
    'Monday-02:00pm': { id: 'biology', name: 'Biology', duration: '50mins', color: 'bg-orange-100', icon: '/assets/biology.svg' },
    'Wednesday-02:00pm': { id: 'biology', name: 'Biology', duration: '50mins', color: 'bg-orange-100', icon: '/assets/biology.svg' },
    
    'Tuesday-03:00pm': { id: 'chemistry', name: 'Chemistry', duration: '50mins', color: 'bg-yellow-100', icon: '/assets/chem.svg' },
    'Friday-03:00pm': { id: 'math', name: 'Further M...', duration: '1hr', color: 'bg-blue-100', icon: '/assets/maths.svg' },
  };


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