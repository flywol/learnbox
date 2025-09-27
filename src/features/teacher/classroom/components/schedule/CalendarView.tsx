// SECURITY LOCKDOWN: This component was accessing admin APIs - temporarily disabled
// TODO: Reimplement with proper teacher-only functionality

// Removed unused React import

interface CalendarViewProps {
  events?: any[];
}

export default function CalendarView(_props: CalendarViewProps) {
  return (
    <div className="p-8 text-center bg-yellow-50 border-2 border-yellow-200 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-yellow-800">🔒 Security Maintenance</h3>
      </div>
      <p className="text-yellow-700 mb-2">
        Calendar functionality is temporarily unavailable while we implement proper security controls.
      </p>
      <p className="text-sm text-yellow-600">
        This prevents unauthorized access to admin data and ensures role-based security.
      </p>
    </div>
  );
}