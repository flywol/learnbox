import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TimetableView from '../components/TimetableView';
import CalendarView from '../components/CalendarView';

export default function SchedulePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'timetable' | 'calendar'>('timetable');

  // Read tab from URL parameters on mount
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as 'timetable' | 'calendar';
    if (tabFromUrl && ['timetable', 'calendar'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
        <p className="text-gray-600 mt-1">View your timetable and upcoming events</p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-1">
          <button
            onClick={() => {
              setActiveTab('timetable');
              setSearchParams({ tab: 'timetable' });
            }}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'timetable'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-700 hover:text-orange-500'
            }`}
          >
            Timetable
          </button>
          <button
            onClick={() => {
              setActiveTab('calendar');
              setSearchParams({ tab: 'calendar' });
            }}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'calendar'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-700 hover:text-orange-500'
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'timetable' && <TimetableView />}
        {activeTab === 'calendar' && <CalendarView />}
      </div>
    </div>
  );
}
