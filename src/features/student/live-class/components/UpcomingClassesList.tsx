import { Calendar } from 'lucide-react';
import { useLiveClassStore } from '../store/liveClassStore';
import { getClassItemTitle, getDisplayTime } from '../utils/liveClassUtils';

export default function UpcomingClassesList() {
  const { upcomingClasses, joinClass } = useLiveClassStore();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Upcoming Classes
      </h2>

      {/* Empty state */}
      {upcomingClasses.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-12">
          <div className="bg-orange-100 rounded-full p-4 mb-3">
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            No upcoming classes
          </h3>
          <p className="text-sm text-gray-600 max-w-xs">
            You don't have any upcoming live classes scheduled at the moment.
          </p>
        </div>
      ) : (
        // Class list
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {upcomingClasses.map((cls) => {
            const title = getClassItemTitle(cls.status);
            const displayTime = getDisplayTime(cls.startTime, cls.status);
            const isNow = cls.status === 'now';

            return (
              <div
                key={cls.id}
                className="flex items-center justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {cls.subject} · {displayTime}
                  </p>
                </div>

                {/* Action button */}
                {isNow ? (
                  <button
                    onClick={() => joinClass(cls.classLink)}
                    className="flex-shrink-0 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Go
                  </button>
                ) : (
                  <span className="flex-shrink-0 bg-gray-100 text-gray-600 px-3 py-1.5 rounded text-xs font-medium">
                    Scheduled
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
