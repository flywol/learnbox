import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TimetableView from './schedule/TimetableView';
import CalendarView from './schedule/CalendarView';


export default function ScheduleTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSubTab, setActiveSubTab] = useState<'timetable' | 'calendar'>('timetable');
  const [selectedClass, setSelectedClass] = useState(''); // Now stores actual class ID

  // Read subtab from URL parameters on mount
  useEffect(() => {
    const subtabFromUrl = searchParams.get('subtab') as 'timetable' | 'calendar';
    if (subtabFromUrl && ['timetable', 'calendar'].includes(subtabFromUrl)) {
      setActiveSubTab(subtabFromUrl);
    }
  }, [searchParams]);

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs Navigation */}
      <div className="flex space-x-1">
        <button
          onClick={() => {
            setActiveSubTab('timetable');
            setSearchParams({ tab: 'schedule', subtab: 'timetable' });
          }}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSubTab === 'timetable'
              ? 'border-b-2 border-orange-500 text-orange-500'
              : 'text-gray-700 hover:text-orange-500'
          }`}
        >
          Timetable
        </button>
        <button
          onClick={() => {
            setActiveSubTab('calendar');
            setSearchParams({ tab: 'schedule', subtab: 'calendar' });
          }}
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