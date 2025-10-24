import { useState } from 'react';
import TimetableView from './TimetableView';
import CalendarView from './CalendarView';

export default function ScheduleTab() {
  const [activeSubTab, setActiveSubTab] = useState<'timetable' | 'calendar'>('timetable');

  return (
    <div className="space-y-6">
      {/* Sub-tabs Navigation */}
      <div className="flex gap-6 border-b border-gray-200">
        <button
          onClick={() => setActiveSubTab('timetable')}
          className={`pb-3 font-medium transition-colors ${
            activeSubTab === 'timetable'
              ? 'border-b-2 border-orange-500 text-orange-500'
              : 'text-gray-700 hover:text-orange-500'
          }`}
        >
          Timetable
        </button>
        <button
          onClick={() => setActiveSubTab('calendar')}
          className={`pb-3 font-medium transition-colors ${
            activeSubTab === 'calendar'
              ? 'border-b-2 border-orange-500 text-orange-500'
              : 'text-gray-700 hover:text-orange-500'
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
