import { useMemo } from 'react';
import { Calendar, ChevronsRight } from 'lucide-react';
import { useWeeklySchedule } from '../../hooks/useTimetable';
import { transformWeeklyScheduleToGrid, formatTimeFor12Hour } from '../../utils/timetableUtils';
import type { TransformedClassForGrid } from '../../types/timetable.types';

// Helper function to get subject icon
const getSubjectIcon = (subjectName: string): string => {
  const lowerName = subjectName.toLowerCase();
  if (lowerName.includes('math') || lowerName.includes('further')) return '📚';
  if (lowerName.includes('english') || lowerName.includes('literature')) return '🟢';
  if (lowerName.includes('biology') || lowerName.includes('bio')) return '🧬';
  if (lowerName.includes('chemistry') || lowerName.includes('chem')) return '🧪';
  if (lowerName.includes('physics')) return '⚛️';
  if (lowerName.includes('history')) return '📜';
  if (lowerName.includes('geography')) return '🌍';
  if (lowerName.includes('art')) return '🎨';
  if (lowerName.includes('music')) return '🎵';
  if (lowerName.includes('sport') || lowerName.includes('physical')) return '⚽';
  if (lowerName.includes('computer') || lowerName.includes('ict')) return '💻';
  return '📖'; // default book icon
};

// Loading component
const LoadingTimetable = () => (
  <div className="space-y-4">
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="grid grid-cols-6 gap-4 mb-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }, (_, j) => (
              <div key={j} className="h-20 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Empty state component
const EmptyTimetable = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
    <div className="w-32 h-24 mx-auto mb-4">
      <Calendar className="w-16 h-16 text-gray-400 mx-auto" />
    </div>
    <h3 className="text-base font-medium text-gray-900 mb-2">No timetable available</h3>
    <p className="text-sm text-gray-500 text-center max-w-sm mx-auto">
      Your teaching schedule will appear here once it's been created by the admin.
    </p>
  </div>
);

export default function TimetableView() {
  // Fetch weekly schedule from API
  const { data: weeklyData, isLoading, error } = useWeeklySchedule();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Transform API data to grid format
  const timetableGrid = useMemo(() => {
    if (!weeklyData?.schedule) return {};
    return transformWeeklyScheduleToGrid(weeklyData.schedule);
  }, [weeklyData]);

  // Determine time slots dynamically based on actual class times
  const timeSlots = useMemo(() => {
    if (!weeklyData?.schedule) {
      // Default time slots
      return ['08:00am', '09:00am', '10:00am', '11:00am', '12:00pm', '01:00pm', '02:00pm', '03:00pm'];
    }

    // Extract all unique time slots from the schedule
    const allTimes = new Set<string>();
    Object.values(weeklyData.schedule).flat().forEach(classData => {
      const [hours] = classData.rawStartTime.split(':').map(Number);
      allTimes.add(`${hours.toString().padStart(2, '0')}:00`);
    });

    // Convert to 12-hour format and sort
    const slots = Array.from(allTimes)
      .sort()
      .map(time => formatTimeFor12Hour(time));

    // If no slots found, use defaults
    return slots.length > 0 ? slots : ['08:00am', '09:00am', '10:00am', '11:00am', '12:00pm', '01:00pm', '02:00pm', '03:00pm'];
  }, [weeklyData]);

  const hasTimetable = Object.keys(timetableGrid).length > 0;

  if (isLoading) {
    return <LoadingTimetable />;
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg border border-red-200 p-8 text-center">
        <p className="text-red-600">Failed to load timetable. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Timetable Content */}
      {!hasTimetable ? (
        <EmptyTimetable />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-6 gap-0 border-b border-gray-200">
            <div className="p-4 bg-gray-50 font-medium text-gray-700">Time</div>
            {days.map((day) => (
              <div key={day} className="p-4 bg-gray-50 font-medium text-gray-700 text-center">
                {day}
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-6 gap-0 border-b border-gray-200 last:border-b-0">
              <div className="p-4 bg-gray-50 font-medium text-gray-600 text-sm flex items-center gap-2">
                <span>{time}</span>
                <ChevronsRight className="w-4 h-4 text-orange-500" />
              </div>
              {days.map((day) => {
                const key = `${day}-${time}`;
                const classes = timetableGrid[key] || [];

                return (
                  <div key={key} className="p-3 h-24 flex items-start justify-center overflow-auto">
                    {classes.length > 0 ? (
                      <div className="w-full flex flex-col gap-2">
                        {classes.map((classItem: TransformedClassForGrid, index: number) => (
                          <div
                            key={`${classItem.subjectName}-${classItem.displayClass}-${index}`}
                            className="bg-white border border-gray-200 rounded-lg p-2.5 flex items-center gap-2.5 transition-all hover:shadow-md cursor-pointer min-w-0"
                            title={`${classItem.subjectName} - ${classItem.displayClass}\n${classItem.displayStartTime} - ${classItem.displayEndTime} (${classItem.duration})`}
                          >
                            <div className="text-xl flex-shrink-0">
                              {getSubjectIcon(classItem.subjectName || '')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-gray-900 leading-tight truncate">
                                {classItem.subjectName || 'N/A'}
                              </div>
                              <div className="text-xs text-gray-600 leading-tight mt-0.5 truncate">
                                {classItem.displayClass}
                              </div>
                              <div className="text-xs text-gray-500 leading-tight mt-0.5">
                                {classItem.displayStartTime}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}