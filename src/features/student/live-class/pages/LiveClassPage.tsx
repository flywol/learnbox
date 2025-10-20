import { useEffect } from 'react';
import { useLiveClassStore } from '../store/liveClassStore';
import TodaysClassCard from '../components/TodaysClassCard';
import UpcomingClassesList from '../components/UpcomingClassesList';

export default function LiveClassPage() {
  const { fetchLiveClasses, isLoading } = useLiveClassStore();

  useEffect(() => {
    fetchLiveClasses();
  }, [fetchLiveClasses]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="text-sm text-gray-600 mt-3">Loading live classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left - Today's Class */}
      <TodaysClassCard />

      {/* Right - Upcoming Classes */}
      <UpcomingClassesList />
    </div>
  );
}
