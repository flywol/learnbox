import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  teacherActionCards,
  mockClassSchedule,
  mockTeacherStats
} from '../config/teacherDashboardConfig';
import type { DashboardEvent } from '@/common/components/dashboard';
import { useAllTasks } from '@/features/teacher/tasks/hooks/useTeacherTasks';
import { calculateTimeLabel } from '@/features/teacher/tasks/utils/taskHelpers';
import type { Task } from '@/features/teacher/tasks/types/task.types';

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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Fetch tasks from API
  const { data: tasksData, isLoading: tasksLoading, error: tasksError } = useAllTasks();

  // Action handlers
  const handleAddTask = () => {
    navigate('/teacher/tasks/create');
  };

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
    // TODO: Fetch schedule for selected day
  };

  const handleTaskClick = (taskId: string) => {
    const task = tasksData?.tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsTaskModalOpen(true);
    }
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleEditTask = (task: Task) => {
    navigate('/teacher/tasks/edit', { state: { task } });
  };

  // Filter schedule based on selected day
  const getScheduleForDay = (day: string) => {
    // For now, return same schedule for all days
    // TODO: Implement day-specific schedule filtering
    console.log('Getting schedule for day:', day);
    return mockClassSchedule;
  };

  // Transform tasks for dashboard display
  const dashboardTasks = useMemo(() => {
    if (!tasksData?.tasks) return [];

    return tasksData.tasks
      .slice(0, 4) // Show max 4 tasks (both completed and pending)
      .map(task => {
        const { label, urgent } = calculateTimeLabel(task.scheduleTime);
        return {
          id: task.id,
          title: task.title,
          timeLabel: label,
          urgent,
          hasAction: true,
          onAction: () => handleTaskClick(task.id)
        };
      });
  }, [tasksData]);

  // Calculate task stats
  const completedTasks = tasksData?.tasks.filter(t => t.isCompleted).length || 0;
  const totalTasks = tasksData?.total || 0;

  return {
    // Configuration
    actionCards: teacherActionCards,

    // Stats data (using API for tasks, keeping mock for other stats until those APIs are ready)
    stats: {
      ...mockTeacherStats,
      completedTasks,
      totalTasks,
    },

    // Tasks data from API
    tasks: dashboardTasks,
    completedTasks,
    totalTasks,

    // Schedule data
    schedule: getScheduleForDay(selectedDay),
    selectedDay,

    // Events data
    events: mockTeacherEvents,
    eventsLoading: false,
    eventsError: null,

    // UI state
    loading: tasksLoading,
    error: tasksError,

    // Task modal state
    selectedTask,
    isTaskModalOpen,

    // Action handlers
    handleAddTask,
    handleDayChange,
    handleTaskClick,
    handleCloseTaskModal,
    handleEditTask,
  };
}