export interface Task {
  id: string;
  title: string;
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
  onAddTask,
}: TasksSectionProps) {
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-[#d6d6d6] p-5">
      <h2 className="text-xl font-semibold text-[#2b2b2b] mb-4">Tasks</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Circular Progress */}
        <div className="flex flex-col items-center justify-center bg-[#ffefe9] rounded-xl p-6 min-h-[288px]">
          <div className="relative w-[100px] h-[100px] mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="#FED7AA" strokeWidth="8" fill="none" />
              <circle
                cx="50" cy="50" r="45"
                stroke="#fd5d26" strokeWidth="8" fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 ease-in-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold text-[#343434]">
                <span className="text-5xl leading-[1.4]">{completedTasks}</span>
                <span className="text-2xl">/{totalTasks}</span>
              </span>
            </div>
          </div>

          <p className="text-lg font-bold text-[#2b2b2b] mb-6">Completed Tasks</p>

          <button
            onClick={onAddTask}
            className="h-6 px-3 bg-[#fd5d26] text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            Add a task
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-4 overflow-y-auto max-h-[288px] pr-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white border border-[#d6d6d6] rounded-xl px-5 py-3 flex items-center justify-between"
            >
              <div className="flex-1 min-w-0 pr-3">
                <p className="text-lg font-bold text-[#2b2b2b] truncate">{task.title}</p>
                <p className="text-xs text-[#6b6b6b]">{task.timeLabel}</p>
              </div>

              {task.hasAction && (
                <button
                  onClick={task.onAction}
                  className={`h-6 px-3 text-sm font-semibold rounded-lg flex-shrink-0 transition-colors ${
                    task.urgent
                      ? 'bg-[#fd5d26] text-white hover:bg-orange-600'
                      : 'bg-[#fcebe8] text-white'
                  }`}
                >
                  Go
                </button>
              )}
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">No tasks yet</p>
              <p className="text-gray-400 text-xs mt-1">Tasks will appear here when created</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
