import { FileDown } from 'lucide-react';
import { TabType } from '../../types/classroom.types';

interface SubjectTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { key: 'lessons', label: 'Lessons' },
  { key: 'live-class', label: 'Live class' },
  { key: 'quiz', label: 'Quiz' },
  { key: 'assignment', label: 'Assignment' },
  { key: 'assessment', label: 'Assessment' },
];

export default function SubjectTabs({ activeTab, onTabChange }: SubjectTabsProps) {
  return (
    <div className="flex justify-between items-center border-b border-gray-200">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key as TabType)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-700 hover:text-orange-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {activeTab === 'assessment' && (
        <button className="flex items-center space-x-2 px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors">
          <FileDown className="w-4 h-4" />
          <span>Export</span>
        </button>
      )}
    </div>
  );
}