import { useState, useEffect } from 'react';
import {
  StatCard,
  ActionCard,
  EventsSection
} from '@/common/components/dashboard';
import {
  Users,
  BookOpen,
  ClipboardList,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import TasksSection from '../components/TasksSection';
import RecentClassesSection from '../components/RecentClassesSection';
import TeacherWelcomeModal from '../../components/TeacherWelcomeModal';
import TaskDetailModal from '../../tasks/components/TaskDetailModal';
import CreateLiveClassModal from '../../classroom/components/modals/CreateLiveClassModal';
import { subjectsClassesApiClient } from '../../classroom/api/subjectsClassesApiClient';
import { useTeacherDashboard } from '../hooks/useTeacherDashboard';

export default function TeacherDashboard() {
  const { user } = useAuthStore();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  const {
    actionCards,
    stats,
    tasks,
    completedTasks,
    totalTasks,
    schedule,
    selectedDay,
    events,
    eventsLoading,
    eventsError,
    loading,
    selectedTask,
    isTaskModalOpen,
    isLiveClassModalOpen,
    handleAddTask,
    handleDayChange,
    handleCloseTaskModal,
    handleEditTask,
    handleCloseLiveClassModal,
  } = useTeacherDashboard();

  // Fetch teacher's subjects for live class modal
  const { data: subjectsData } = useQuery({
    queryKey: ['teacher-subjects-classes'],
    queryFn: () => subjectsClassesApiClient.getTeacherSubjectsAndClasses(),
    staleTime: 5 * 60 * 1000,
  });

  const teacherSubjects = subjectsData?.assignedSubjects.map(s => ({
    id: s._id,
    name: s.name
  })) || [];

  useEffect(() => {
    // Show welcome modal for teacher users who haven't seen it
    if (user?.role === "TEACHER" && !localStorage.getItem('teacher-welcome-seen')) {
      setShowWelcomeModal(true);
    }
  }, [user]);

  return (
    <>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content - Left Side (3/4) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Welcome Header */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome {user?.fullName?.split(" ")[0] || "Joe"}, what do you want to do today?
            </h1>
            
            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {actionCards.map((action, index) => (
                <ActionCard
                  key={index}
                  iconSrc={action.iconSrc}
                  title={action.title}
                  description={action.description}
                  onClick={action.onClick}
                  buttonText={action.buttonText}
                />
              ))}
            </div>
          </div>

          {/* Classroom Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Classroom Overview</h2>

            {/* Top Row Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <StatCard
                icon={Users}
                label="Total students"
                value={stats.totalStudents}
                iconColor="text-red-500"
                loading={loading}
              />
              <StatCard
                icon={BookOpen}
                label="Total classes"
                value={stats.totalClasses}
                iconColor="text-blue-500"
                loading={loading}
              />
              <StatCard
                icon={ClipboardList}
                label="Assignment created"
                value={stats.assignmentCreated}
                iconColor="text-green-500"
                loading={loading}
              />
            </div>

            {/* Bottom Row Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={AlertCircle}
                label="Not graded"
                value={stats.notGraded}
                iconColor="text-red-500"
                loading={loading}
              />
              <StatCard
                icon={FileText}
                label="Quiz created"
                value={stats.quizCreated}
                iconColor="text-purple-500"
                loading={loading}
              />
              <StatCard
                icon={CheckCircle}
                label="Not graded"
                value={stats.notGradedQuiz}
                iconColor="text-orange-500"
                loading={loading}
              />
            </div>
          </div>

          {/* Tasks Section */}
          <TasksSection
            completedTasks={completedTasks}
            totalTasks={totalTasks}
            tasks={tasks}
            onAddTask={handleAddTask}
          />
        </div>

        {/* Sidebar - Right Side (1/4) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recent Classes */}
          <RecentClassesSection
            classes={schedule}
            selectedDay={selectedDay}
            onDayChange={handleDayChange}
          />

          {/* Events */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[400px] flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Events</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <EventsSection
                events={events}
                isLoading={eventsLoading}
                error={eventsError?.message || null}
                maxEvents={5}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TeacherWelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
      />

      <TaskDetailModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        task={selectedTask}
        onEdit={handleEditTask}
      />

      <CreateLiveClassModal
        isOpen={isLiveClassModalOpen}
        onClose={handleCloseLiveClassModal}
        subjects={teacherSubjects}
      />
    </>
  );
}