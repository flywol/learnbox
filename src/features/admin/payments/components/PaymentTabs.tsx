interface PaymentTabsProps {
  activeTab: 'overview' | 'transactions' | 'fees';
  onTabChange: (tab: 'overview' | 'transactions' | 'fees') => void;
}

export default function PaymentTabs({ activeTab, onTabChange }: PaymentTabsProps) {
  const tabs = [
    { key: 'overview' as const, label: 'Overview' },
    { key: 'transactions' as const, label: 'Transaction list' },
    { key: 'fees' as const, label: 'Fees' },
  ];

  return (
    <div className="flex space-x-1 border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
            activeTab === tab.key
              ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-500'
              : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}