
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

import { useAuthStore } from '@/features/auth/store/authStore';
import TasksSection from '../components/TasksSection';
import RecentClassesSection from '../components/RecentClassesSection';
import TeacherWelcomeModal from '../../components/TeacherWelcomeModal';
import TaskDetailModal from '../../tasks/components/TaskDetailModal';
import CreateLiveClassModal from '../../classroom/components/modals/CreateLiveClassModal';

import { useTeacherDashboard } from '../hooks/useTeacherDashboard';
import { getFirstName } from '@/common/utils/userUtils';

export default function TeacherDashboard() {
  const user = useAuthStore((state) => state.user);
  const {
    stats,
    loading,
    tasks,
    completedTasks,
    totalTasks,
    schedule,
    selectedDay,
    handleDayChange,
    events,
    eventsLoading,
    eventsError,
    showWelcomeModal,
    setShowWelcomeModal,
    isTaskModalOpen,
    handleCloseTaskModal,
    selectedTask,
    handleEditTask,
    handleAddTask,
    actionCards,
    isLiveClassModalOpen,
    handleCloseLiveClassModal,
    teacherSubjects,
  } = useTeacherDashboard();

  const firstName = getFirstName(user?.fullName, 'Joe');

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column (3/4) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Welcome section */}
          <div className="bg-white rounded-2xl border border-[#d6d6d6] p-6">
            <h1 className="text-xl font-semibold text-[#2b2b2b] mb-6">
              Welcome{' '}
              <span className="text-[#fd5d26]">{firstName},</span>{' '}
              what do you want to do today?
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="bg-white rounded-2xl border border-[#d6d6d6] p-6">
            <h2 className="text-xl font-semibold text-[#2b2b2b] mb-5">Classroom Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <StatCard
                icon={Users}
                label="Total students"
                value={stats.totalStudents}
                loading={loading}
              />
              <StatCard
                icon={BookOpen}
                label="Total classes"
                value={stats.totalClasses}
                loading={loading}
              />
              <StatCard
                icon={ClipboardList}
                label="Assignment created"
                value={stats.assignmentCreated}
                loading={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <StatCard
                icon={AlertCircle}
                label="Not graded"
                value={stats.notGraded}
                loading={loading}
              />
              <StatCard
                icon={FileText}
                label="Quiz created"
                value={stats.quizCreated}
                loading={loading}
              />
              <StatCard
                icon={CheckCircle}
                label="Not graded"
                value={stats.notGradedQuiz}
                loading={loading}
              />
            </div>
          </div>

          {/* Tasks */}
          <TasksSection
            completedTasks={completedTasks}
            totalTasks={totalTasks}
            tasks={tasks}
            onAddTask={handleAddTask}
          />
        </div>

        {/* Right sidebar (1/4) */}
        <div className="lg:col-span-1 space-y-6">
          <RecentClassesSection
            classes={schedule}
            selectedDay={selectedDay}
            onDayChange={handleDayChange}
          />

          {/* Events */}
          <div className="bg-white rounded-2xl border border-[#d6d6d6] flex flex-col max-h-[500px]">
            <div className="px-5 pt-5 pb-3 border-b border-[#eee] flex-shrink-0">
              <h2 className="text-xl font-semibold text-[#2b2b2b]">Events</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
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
