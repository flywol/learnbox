import { useState } from 'react';
import TimetableView from './TimetableView';
import CalendarView from './CalendarView';

export default function ScheduleTab() {
  const [activeSubTab, setActiveSubTab] = useState<'timetable' | 'calendar'>('timetable');

  return (
    <div className="space-y-6">
      {/* Sub-tabs Navigation */}
      <div className="bg-gray-100/80 p-1 rounded-lg inline-flex">
        <button
          onClick={() => setActiveSubTab('timetable')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeSubTab === 'timetable'
              ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
          }`}
        >
          Timetable
        </button>
        <button
          onClick={() => setActiveSubTab('calendar')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeSubTab === 'calendar'
              ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
          }`}
        >
          Calendar
        </button>
      </div>

      {/* Tab Content */}
      {activeSubTab === 'timetable' && <TimetableView />}
      {activeSubTab === 'calendar' && <CalendarView />}
    </div>
  );
}
