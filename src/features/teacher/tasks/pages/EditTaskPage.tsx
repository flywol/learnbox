import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { createTaskSchema, type CreateTaskFormData } from '../schemas/taskSchema';
import { type TaskType, type RepeatOption, type Task } from '../types/task.types';
import TimePicker from '../components/ui/TimePicker';
import { useToast } from '@/hooks/use-toast';
import { useUpdateTask } from '../hooks/useTeacherTasks';
import { formatTimeForApi, formatDateForApi, parseTimeFromApi } from '../utils/taskHelpers';

const taskTypeOptions: TaskType[] = ['Assignment', 'Quiz', 'Class', 'Custom'];
const repeatOptions: RepeatOption[] = [
  'none',
  'daily',
  'weekly',
  'monthly',
  'yearly'
];

const repeatLabels: Record<RepeatOption, string> = {
  none: 'Does not repeat',
  daily: 'Every day',
  weekly: 'Every week',
  monthly: 'Every month',
  yearly: 'Every year'
};

export default function EditTaskPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const updateTaskMutation = useUpdateTask();

  // Get task from location state
  const task = location.state?.task as Task | undefined;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      taskType: 'Assignment',
      repeat: 'none'
    }
  });

  const watchedTime = watch('scheduleTime');
  const watchedTaskType = watch('taskType');

  // Populate form with existing task data
  useEffect(() => {
    if (task) {
      // Extract date from ISO string (e.g., "2025-01-15T00:00:00Z" -> "2025-01-15")
      const dateMatch = task.startDate.match(/^(\d{4}-\d{2}-\d{2})/);
      const startDateFormatted = dateMatch ? dateMatch[1] : '';

      setValue('title', task.title);
      setValue('description', task.description);
      setValue('scheduleStartDate', startDateFormatted);
      setValue('scheduleTime', parseTimeFromApi(task.scheduleTime));
      setValue('taskType', task.taskType);
      setValue('repeat', task.repeat);
    } else {
      // If no task in state, redirect back to dashboard
      navigate('/teacher/dashboard');
    }
  }, [task, setValue, navigate]);

  const onSubmit = async (data: CreateTaskFormData) => {
    if (!task) return;

    try {
      // Transform form data to API format
      const apiData = {
        title: data.title,
        description: data.description,
        startDate: formatDateForApi(data.scheduleStartDate),
        scheduleTime: formatTimeForApi(data.scheduleStartDate, data.scheduleTime),
        taskType: data.taskType,
        repeat: data.repeat,
      };

      // Call API
      await updateTaskMutation.mutateAsync({ id: task.id, data: apiData });

      // Show success toast
      toast({
        title: "Task updated successfully!",
        description: `"${data.title}" has been updated.`,
      });

      // Navigate back to dashboard
      navigate('/teacher/dashboard');
    } catch (error) {
      // Error handling
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again.";

      toast({
        title: "Error updating task",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (!task) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/teacher/dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title and Description Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                {...register('title')}
                type="text"
                placeholder="Title *"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                placeholder="Description *"
                rows={1}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Schedule Date and Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule start date *
              </label>
              <div className="relative">
                <input
                  {...register('scheduleStartDate')}
                  type="date"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.scheduleStartDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.scheduleStartDate && (
                <p className="mt-1 text-sm text-red-600">{errors.scheduleStartDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule time *
              </label>
              <TimePicker
                value={watchedTime || ''}
                onChange={(time) => setValue('scheduleTime', time)}
                error={errors.scheduleTime?.message}
              />
            </div>
          </div>

          {/* Task Type and Repeat Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task type *
              </label>
              <div className="relative">
                <select
                  {...register('taskType')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none ${
                    errors.taskType ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  {taskTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.taskType && (
                <p className="mt-1 text-sm text-red-600">{errors.taskType.message}</p>
              )}

              {/* Custom Task Type Input - Show when Custom is selected */}
              {watchedTaskType === 'Custom' && (
                <div className="mt-3">
                  <input
                    {...register('customTaskType')}
                    type="text"
                    placeholder="Enter custom task type"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.customTaskType ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.customTaskType && (
                    <p className="mt-1 text-sm text-red-600">{errors.customTaskType.message}</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repeat *
              </label>
              <div className="relative">
                <select
                  {...register('repeat')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none ${
                    errors.repeat ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  {repeatOptions.map((option) => (
                    <option key={option} value={option}>
                      {repeatLabels[option]}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.repeat && (
                <p className="mt-1 text-sm text-red-600">{errors.repeat.message}</p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/teacher/dashboard')}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateTaskMutation.isPending}
              className={`px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                updateTaskMutation.isPending ? 'cursor-wait' : ''
              }`}
            >
              {updateTaskMutation.isPending ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
