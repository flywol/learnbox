import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createTeacherActionCards,
} from '../config/teacherDashboardConfig';
import { useAllTasks } from '@/features/teacher/tasks/hooks/useTeacherTasks';
import { calculateTimeLabel } from '@/features/teacher/tasks/utils/taskHelpers';
import type { Task } from '@/features/teacher/tasks/types/task.types';
import { useDashboardData } from './useDashboardData';
import { useTodayClasses } from '@/features/teacher/classroom/hooks/useTimetable';
import { transformClassForGrid } from '@/features/teacher/classroom/utils/timetableUtils';
import type { ClassSchedule } from '../components/RecentClassesSection';
import { subjectsClassesApiClient } from '../../classroom/api/subjectsClassesApiClient';
import { useQuery } from '@tanstack/react-query';

export function useTeacherDashboard() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState('Today');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isLiveClassModalOpen, setIsLiveClassModalOpen] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Fetch dashboard data from API
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useDashboardData();

  // Fetch tasks from API (keeping existing tasks integration)
  const { data: tasksData, isLoading: tasksLoading, error: tasksError } = useAllTasks();

  // Fetch today's classes from API
  const { data: todayClassesData, isLoading: classesLoading } = useTodayClasses();

  // Fetch teacher subjects
  const { data: subjectsData } = useQuery({
    queryKey: ['teacher-subjects'],
    queryFn: () => subjectsClassesApiClient.getTeacherSubjectsAndClasses(),
  });

  // Action handlers
  const handleAddTask = () => {
    navigate('/teacher/tasks/create');
  };

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
    // Note: Currently only "Today" is supported by the API
    // Future: Implement day-specific filtering
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

  const handleOpenLiveClassModal = () => {
    setIsLiveClassModalOpen(true);
  };

  const handleCloseLiveClassModal = () => {
    setIsLiveClassModalOpen(false);
  };

  // Transform today's classes to schedule format
  const todaySchedule = useMemo((): ClassSchedule[] => {
    if (!todayClassesData?.classes) return [];

    // Transform and expand each class for each arm
    const expandedClasses: ClassSchedule[] = [];

    todayClassesData.classes.forEach(classData => {
      const transformedClasses = transformClassForGrid(classData);

      transformedClasses.forEach(tc => {
        expandedClasses.push({
          time: tc.displayStartTime,
          subject: tc.subjectName,
          duration: tc.duration,
          classCode: tc.displayClass,
          isEmpty: false,
        });
      });
    });

    // Sort by time
    return expandedClasses.sort((a, b) => {
      const timeA = a.time.replace(/[ap]m/, '');
      const timeB = b.time.replace(/[ap]m/, '');
      return timeA.localeCompare(timeB);
    });
  }, [todayClassesData]);

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

  // Calculate task stats (from existing tasks API)
  const completedTasks = tasksData?.tasks.filter(t => t.isCompleted).length || 0;
  const totalTasks = tasksData?.total || 0;

  // Transform events from dashboard API
  const transformedEvents = useMemo(() => {
    if (!dashboardData?.events) return [];
    return dashboardData.events.map(event => ({
      id: event._id,
      description: event.description,
      receivers: event.receivers,
      date: event.date
    }));
  }, [dashboardData?.events]);

  // Generate action cards with handlers
  const actionCards = useMemo(() => createTeacherActionCards({
    onAddLiveClass: handleOpenLiveClassModal,
  }), []);

  return {
    // Configuration
    actionCards,

    // Stats data from dashboard API
    stats: {
      totalStudents: dashboardData?.classroomOverview.totalStudents || 0,
      totalClasses: dashboardData?.classroomOverview.totalClasses || 0,
      assignmentCreated: dashboardData?.classroomOverview.assignmentsCreated || 0,
      notGraded: dashboardData?.classroomOverview.assignmentsNotGraded || 0,
      quizCreated: 0, // No quiz endpoint yet
      notGradedQuiz: 0, // No quiz endpoint yet
      overdueCreated: dashboardData?.classroomOverview.overdueCreated || 0,
      overdueNotGraded: dashboardData?.classroomOverview.overdueNotGraded || 0,
      completedTasks,
      totalTasks,
    },

    // Tasks data from API (keeping existing tasks integration)
    tasks: dashboardTasks,
    completedTasks,
    totalTasks,

    // Schedule data from today's classes API
    schedule: todaySchedule,
    selectedDay,

    // Events data from dashboard API
    events: transformedEvents,
    eventsLoading: dashboardLoading,
    eventsError: dashboardError,

    // UI state
    loading: tasksLoading || dashboardLoading || classesLoading,
    error: tasksError || dashboardError,

    // Task modal state
    selectedTask,
    isTaskModalOpen,

    // Live class modal state
    isLiveClassModalOpen,

    // Action handlers
    handleAddTask,
    handleDayChange,
    handleTaskClick,
    handleCloseTaskModal,
    handleEditTask,
    handleOpenLiveClassModal,
    handleCloseLiveClassModal,
    
    // Welcome modal
    showWelcomeModal,
    setShowWelcomeModal,

    // Subjects
    teacherSubjects: subjectsData?.assignedSubjects.map(s => ({
      id: s._id,
      name: s.name
    })) || [],
  };
}