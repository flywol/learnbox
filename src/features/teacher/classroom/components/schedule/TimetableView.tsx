import { Plus, Calendar, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { timetableApiClient } from '../../api/timetableApiClient';
import { convertTimetableToGrid } from '../../utils/timetableUtils';
import type { TimetableGrid } from '../../types/timetable.types';

interface TimetableViewProps {
  selectedClass: string;
  onClassChange: (classId: string) => void;
}

// Loading component
const LoadingTimetable = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
    </div>
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

// Enhanced Error component with better UX
const TimetableError = ({ message, onRetry, showRetry = true }: { message: string; onRetry: () => void; showRetry?: boolean }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <span className="text-gray-400">Class:</span>
        <div className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-400">
          Select class
        </div>
      </div>
      <button
        disabled
        className="flex items-center space-x-2 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        <span>Add timetable</span>
      </button>
    </div>
    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load timetable</h3>
      <p className="text-gray-500 mb-4">{message}</p>
      {showRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  </div>
);

// Empty state component
const EmptyTimetable = ({ onAddTimetable }: { onAddTimetable: () => void }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
    <div className="w-32 h-24 mx-auto mb-4">
      <img 
        src="/assets/timetable-empty.svg" 
        alt="No timetable" 
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback to icon if image not found
          (e.target as HTMLImageElement).style.display = 'none';
          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
        }}
      />
      <Calendar className="w-16 h-16 text-gray-400 mx-auto hidden" />
    </div>
    <h3 className="text-base font-medium text-gray-900 mb-2">No timetable created yet</h3>
    <p className="text-sm text-gray-500 text-center max-w-sm mx-auto mb-6">
      Create a timetable for this class to help students and teachers stay organized.
    </p>
    <button
      onClick={onAddTimetable}
      className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
    >
      Create Timetable
    </button>
  </div>
);

export default function TimetableView({
  selectedClass,
  onClassChange,
}: TimetableViewProps) {
  const navigate = useNavigate();
  const timeSlots = [
    '08:00am', '09:00am', '10:00am', '11:00am', '12:00pm', 
    '01:00pm', '02:00pm', '03:00pm'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Fetch available class levels from API
  const { 
    data: availableClasses = [], 
    isLoading: classesLoading 
  } = useQuery({
    queryKey: ['class-levels'],
    queryFn: () => timetableApiClient.getClassLevels(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Use first available class as default if none selected or selected class not found
  const effectiveClassId = selectedClass && availableClasses.some(cls => cls.id === selectedClass) 
    ? selectedClass 
    : availableClasses[0]?.id || '';
  
  // Fetch timetable data from API
  const { 
    data: timetableData, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['timetable', effectiveClassId],
    queryFn: () => timetableApiClient.getTimetable(effectiveClassId),
    enabled: !!effectiveClassId, // Only run query when we have a valid class ID
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  
  // Convert timetable data to grid format
  const timetableGrid: TimetableGrid = convertTimetableToGrid(timetableData || null);
  const hasTimetable = timetableData !== null;

  if (isLoading || classesLoading) {
    return <LoadingTimetable />;
  }

  if (error) {
    return <TimetableError message="Please try refreshing the page" onRetry={() => refetch()} />;
  }

  if (availableClasses.length === 0) {
    return (
      <TimetableError 
        message="No classes found. Please create classes through the school setup first." 
        onRetry={() => refetch()} 
        showRetry={false}
      />
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Class Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Class:</span>
          <select 
            value={effectiveClassId} 
            onChange={(e) => onClassChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {availableClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => navigate(`/classroom/add-timetable?classId=${effectiveClassId}`)}
          className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{hasTimetable ? 'Edit timetable' : 'Add timetable'}</span>
        </button>
      </div>

      {/* Timetable Content */}
      {!hasTimetable ? (
        <EmptyTimetable onAddTimetable={() => navigate(`/classroom/add-timetable?classId=${effectiveClassId}`)} />
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
              <div className="p-4 bg-gray-50 font-medium text-gray-600 text-sm">
                {time}
              </div>
              {days.map((day) => {
                const key = `${day}-${time}`;
                const subject = timetableGrid[key];
                
                return (
                  <div key={key} className="p-2 h-24 flex items-center justify-center">
                    {subject ? (
                      <div 
                        className={`w-full h-full rounded-lg ${subject.color} p-3 flex flex-col justify-center items-center text-center transition-all hover:shadow-md hover:scale-105 cursor-pointer`}
                        onClick={() => navigate(`/classroom/add-timetable?classId=${effectiveClassId}&editSubject=${subject.subjectName}&day=${day}&time=${time}`)}
                        title={`Edit ${subject.subjectName} on ${day} at ${time}`}
                      >
                        {subject.icon && (
                          <div className="w-5 h-5 mb-1 flex-shrink-0">
                            <img 
                              src={subject.icon} 
                              alt={subject.subjectName} 
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="text-xs font-semibold mb-1 leading-tight">
                          {subject.subjectName.length > 10 ? 
                            `${subject.subjectName.substring(0, 10)}...` : 
                            subject.subjectName
                          }
                        </div>
                        <div className="text-xs opacity-75 leading-tight">
                          {subject.duration}
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="w-full h-full hover:bg-orange-50 hover:border-orange-200 border border-transparent rounded-lg transition-all cursor-pointer flex items-center justify-center group"
                        onClick={() => navigate(`/classroom/add-timetable?classId=${effectiveClassId}&day=${day}&time=${time}`)}
                        title={`Add subject for ${day} at ${time}`}
                      >
                        <div className="text-gray-300 group-hover:text-orange-500 text-xs transition-colors">+</div>
                      </div>
                    )}
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