import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ClassOverviewTab from '../components/ClassOverviewTab';
import ScheduleTab from '../components/ScheduleTab';
import BroadsheetTab from '../components/BroadsheetTab';
import type { ClassroomTab } from '../types/classroom.types';

const tabs = [
  { id: 'class', label: 'Class' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'broadsheet', label: 'Broadsheet' },
] as const;

export default function ClassroomOverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<ClassroomTab>('class');

  // Read tab from URL parameters on mount
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as ClassroomTab;
    if (tabFromUrl && ['class', 'schedule', 'broadsheet'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchParams({ tab: tab.id });
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg">
        {activeTab === 'class' && <ClassOverviewTab />}
        {activeTab === 'schedule' && <ScheduleTab />}
        {activeTab === 'broadsheet' && <BroadsheetTab />}
      </div>
    </div>
  );
}