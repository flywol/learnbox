import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface SettingsSectionProps {
  onSessionConfig?: () => void;
}

export default function SettingsSection({}: SettingsSectionProps) {
  const [accessibilityExpanded, setAccessibilityExpanded] = useState(false);
  const [receiveNotifications] = useState(true);

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>

      <div className="space-y-4">
        {/* Receive Notifications - Read-only for now */}
        <div className="flex items-center justify-between py-3">
          <span className="text-gray-900">Receive Notifications</span>
          <label className="relative inline-flex items-center cursor-not-allowed opacity-60">
            <input
              type="checkbox"
              checked={receiveNotifications}
              disabled
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>

        {/* Accessibility Features */}
        <div className="py-3">
          <button
            onClick={() => setAccessibilityExpanded(!accessibilityExpanded)}
            className="flex items-center justify-between w-full text-left text-gray-900"
          >
            <span>Accessibility Features</span>
            {accessibilityExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5 transform -rotate-90" />
            )}
          </button>
          {accessibilityExpanded && (
            <div className="mt-2 pl-4 space-y-2 text-sm text-gray-600">
              <p>• High contrast mode</p>
              <p>• Large text</p>
              <p>• Screen reader support</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}