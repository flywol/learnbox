interface SessionHistorySectionProps {
  pastSessions: any[];
}

export default function SessionHistorySection({ pastSessions }: SessionHistorySectionProps) {
  if (!pastSessions || pastSessions.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Sessions</h2>
        <div className="text-center py-8 text-gray-500">
          No past sessions available
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Sessions</h2>
      <div className="space-y-4">
        {pastSessions.slice(0, 3).map((session, index) => (
          <div key={session.id || index} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">{session.name}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              {session.startDate && <p>Start: {new Date(session.startDate).toLocaleDateString()}</p>}
              {session.endDate && <p>End: {new Date(session.endDate).toLocaleDateString()}</p>}
              <p>Terms: {session.terms?.length || 0}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}