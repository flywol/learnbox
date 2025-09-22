import { Clock, Calendar } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  subject: string;
  timeLabel: string;
  urgent?: boolean;
  hasAction?: boolean;
  onAction?: () => void;
}

interface TasksSectionProps {
  completedTasks: number;
  totalTasks: number;
  tasks: Task[];
  onAddTask?: () => void;
}

export default function TasksSection({
  completedTasks,
  totalTasks,
  tasks,
  onAddTask
}: TasksSectionProps) {
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const circumference = 2 * Math.PI * 45; // radius of 45
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Tasks</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Circular Progress */}
        <div className="flex flex-col items-center justify-center bg-orange-50 rounded-lg p-6">
          <div className="relative w-32 h-32 mb-4">
            {/* Background circle */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#FED7AA"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#FF725E"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 ease-in-out"
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">
                {completedTasks}
                <span className="text-lg text-gray-500">/{totalTasks}</span>
              </span>
            </div>
          </div>
          
          <p className="text-sm font-medium text-gray-700 mb-4">Completed Tasks</p>
          
          <button
            onClick={onAddTask}
            className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            Add a task
          </button>
        </div>

        {/* Right Side - Task List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{task.subject}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    {task.urgent ? (
                      <Clock className="w-3 h-3 text-red-500" />
                    ) : (
                      <Calendar className="w-3 h-3" />
                    )}
                    <span className={task.urgent ? "text-red-600 font-medium" : ""}>
                      {task.timeLabel}
                    </span>
                  </div>
                </div>
              </div>
              
              {task.hasAction && (
                <button
                  onClick={task.onAction}
                  className="px-3 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-md hover:bg-orange-600 transition-colors"
                >
                  Go
                </button>
              )}
            </div>
          ))}
          
          {tasks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No tasks yet</p>
              <p className="text-gray-400 text-xs mt-1">Tasks will appear here when created</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}