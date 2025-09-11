import { useState } from 'react';
import TimetableView from './schedule/TimetableView';
import CalendarView from './schedule/CalendarView';


export default function ScheduleTab() {
  const [activeSubTab, setActiveSubTab] = useState<'timetable' | 'calendar'>('timetable');
  const [selectedClass, setSelectedClass] = useState(''); // Now stores actual class ID

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
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
          onClassChange={handleClassChange}
        />
      )}

      {activeSubTab === 'calendar' && (
        <CalendarView />
      )}
    </div>
  );
}