import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { createTaskSchema, type CreateTaskFormData } from '../schemas/taskSchema';
import { type TaskType, type RepeatOption } from '../types/task.types';
import TimePicker from '../components/ui/TimePicker';
import { useToast } from '@/hooks/use-toast';

const taskTypeOptions: TaskType[] = ['Assignment', 'Quiz', 'Class', 'Custom'];
const repeatOptions: RepeatOption[] = [
  'Does not repeat', 
  'Every day', 
  'Every week', 
  'Every month', 
  'Every year'
];

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      repeat: 'Does not repeat'
    }
  });

  const watchedTime = watch('scheduleTime');
  const watchedTaskType = watch('taskType');

  const onSubmit = async (data: CreateTaskFormData) => {
    setIsSubmitting(true);
    try {
      // Mock task creation - log the data
      console.log('Creating task:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success toast
      toast({
        title: "Task created successfully!",
        description: `"${data.title}" has been added to your tasks.`,
      });
      
      // Navigate back to dashboard
      navigate('/teacher/dashboard');
    } catch {
      toast({
        title: "Error creating task",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Add a Task</h1>
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
                      {option}
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

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full md:w-auto px-8 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                isSubmitting ? 'cursor-wait' : ''
              }`}
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}