import { Video } from 'lucide-react';
import { useLiveClassStore } from '../store/liveClassStore';
import { getStatusMessage } from '../utils/liveClassUtils';

export default function TodaysClassCard() {
  const { todaysClass, joinClass } = useLiveClassStore();

  // Empty state - no class today
  if (!todaysClass) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Today's Class
        </h2>
        <div className="bg-[#FEF6F3] rounded-lg p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
          <div className="bg-orange-100 rounded-full p-6 mb-4">
            <Video className="h-12 w-12 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No class scheduled today
          </h3>
          <p className="text-sm text-gray-600 max-w-sm">
            Check your upcoming classes to see when your next live session is scheduled.
          </p>
        </div>
      </div>
    );
  }

  const statusMessage = getStatusMessage(todaysClass.status, todaysClass.subject);
  const showJoinButton = todaysClass.status === 'now' || todaysClass.status === 'starting-soon';

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Today's Class
      </h2>
      <div className="bg-[#FEF6F3] rounded-lg p-8 flex items-center justify-between gap-8">
        {/* Content */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {statusMessage}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Teacher: {todaysClass.teacher}
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Duration: {todaysClass.duration}
          </p>

          {showJoinButton && (
            <button
              onClick={() => joinClass(todaysClass.classLink)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Video className="h-5 w-5" />
              Join
            </button>
          )}
        </div>

        {/* Illustration */}
        <div className="hidden md:block flex-shrink-0">
          <img
            src="/images/onboarding/student-2.svg"
            alt="Student learning"
            className="w-48 h-48 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
