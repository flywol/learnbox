import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  teacherActionCards, 
  mockTeacherTasks, 
  mockClassSchedule, 
  mockTeacherStats 
} from '../config/teacherDashboardConfig';
import type { DashboardEvent } from '@/common/components/dashboard';

// Mock events data for teacher dashboard
const mockTeacherEvents: DashboardEvent[] = [
  {
    id: '1',
    description: "Children's Day",
    date: '2025-05-27',
    receivers: 'all'
  },
  {
    id: '2', 
    description: 'Open Day',
    date: '2025-05-30',
    receivers: 'all'
  },
  {
    id: '3',
    description: 'Open Day',
    date: '2025-05-30',
    receivers: 'parents'
  },
  {
    id: '4',
    description: 'Open Day',
    date: '2025-05-30', 
    receivers: 'students'
  },
  {
    id: '5',
    description: 'Open Day',
    date: '2025-05-30',
    receivers: 'teachers'
  }
];

export function useTeacherDashboard() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState('Today');
  const [loading] = useState(false);

  // Action handlers
  const handleAddTask = () => {
    navigate('/teacher/tasks/create');
  };

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
    // TODO: Fetch schedule for selected day
  };

  // Filter schedule based on selected day
  const getScheduleForDay = (day: string) => {
    // For now, return same schedule for all days
    // TODO: Implement day-specific schedule filtering
    console.log('Getting schedule for day:', day);
    return mockClassSchedule;
  };

  return {
    // Configuration
    actionCards: teacherActionCards,
    
    // Stats data
    stats: mockTeacherStats,
    
    // Tasks data
    tasks: mockTeacherTasks,
    completedTasks: mockTeacherStats.completedTasks,
    totalTasks: mockTeacherStats.totalTasks,
    
    // Schedule data
    schedule: getScheduleForDay(selectedDay),
    selectedDay,
    
    // Events data
    events: mockTeacherEvents,
    eventsLoading: false,
    eventsError: null,
    
    // UI state
    loading,
    
    // Action handlers
    handleAddTask,
    handleDayChange
  };
}