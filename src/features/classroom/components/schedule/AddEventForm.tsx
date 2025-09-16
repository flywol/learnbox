import { Calendar as CalendarIcon, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApiClient } from '@/features/events/api/eventsApiClient';
import { inputDateToApiDate } from '@/features/events/utils/dateUtils';
import { createEventSchema, type CreateEventFormData } from '@/features/events/schemas/eventSchemas';
import { RECEIVER_OPTIONS, REPEAT_OPTIONS } from '@/features/events/types/events.types';

interface AddEventFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

export default function AddEventForm({ onCancel, onSubmit }: AddEventFormProps) {
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      description: '',
      receivers: 'all',
      date: '',
      repeat: 'no',
      startTime: '',
      endTime: '',
    },
    mode: 'onChange',
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: CreateEventFormData) => {
      const apiDate = inputDateToApiDate(data.date);
      return eventsApiClient.createEvent({
        description: data.description,
        receivers: data.receivers,
        date: apiDate,
        repeat: data.repeat,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch events
      queryClient.invalidateQueries({ queryKey: ['events'] });
      onSubmit();
    },
    onError: (error) => {
      console.error('Failed to create event:', error);
      // You might want to show a toast notification here
    },
  });

  const onFormSubmit = (data: CreateEventFormData) => {
    createEventMutation.mutate(data);
  };

  const isLoading = createEventMutation.isPending;
  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Header */}
      <div className="grid grid-cols-3 items-center">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          ←
        </button>
        <h3 className="text-xl font-semibold text-center">Add event</h3>
        <div />
      </div>

      <div className="space-y-6">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
          <textarea
            {...register('description')}
            placeholder="Enter event description..."
            className={`w-full px-3 py-2 border rounded-lg h-24 resize-none ${
              errors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
            } focus:outline-none focus:ring-1 focus:ring-orange-500`}
            maxLength={100}
            disabled={isLoading}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">Maximum 100 characters</p>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Date</label>
          <div className="relative">
            <input
              {...register('date')}
              type="date"
              className={`w-full px-3 py-2 border rounded-lg pr-10 ${
                errors.date ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
              } focus:outline-none focus:ring-1 focus:ring-orange-500`}
              disabled={isLoading}
            />
            <CalendarIcon className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Specify Receiver */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Specify receiver</label>
          <div className="relative">
            <select 
              {...register('receivers')}
              className={`w-full px-3 py-2 border rounded-lg appearance-none pr-10 ${
                errors.receivers ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
              } focus:outline-none focus:ring-1 focus:ring-orange-500`}
              disabled={isLoading}
            >
              {RECEIVER_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.receivers && (
            <p className="text-red-500 text-xs mt-1">{errors.receivers.message}</p>
          )}
        </div>

        {/* Repeat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Repeat</label>
          <div className="relative">
            <select 
              {...register('repeat')}
              className={`w-full px-3 py-2 border rounded-lg appearance-none pr-10 ${
                errors.repeat ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
              } focus:outline-none focus:ring-1 focus:ring-orange-500`}
              disabled={isLoading}
            >
              {REPEAT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.repeat && (
            <p className="text-red-500 text-xs mt-1">{errors.repeat.message}</p>
          )}
        </div>

        {/* Time (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time (Optional)</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              {...register('startTime')}
              type="time"
              placeholder="Start time"
              className={`px-3 py-2 border rounded-lg ${
                errors.startTime ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
              } focus:outline-none focus:ring-1 focus:ring-orange-500`}
              disabled={isLoading}
            />
            <input
              {...register('endTime')}
              type="time"
              placeholder="End time"
              className={`px-3 py-2 border rounded-lg ${
                errors.endTime ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
              } focus:outline-none focus:ring-1 focus:ring-orange-500`}
              disabled={isLoading}
            />
          </div>
          {errors.startTime && (
            <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>
          )}
          {errors.endTime && (
            <p className="text-red-500 text-xs mt-1">{errors.endTime.message}</p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {createEventMutation.isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Failed to create event</span>
          </div>
          <p className="mt-1 text-sm text-red-700">
            {createEventMutation.error instanceof Error 
              ? createEventMutation.error.message 
              : 'Please check your connection and try again.'}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button 
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={!isValid || isLoading}
          className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Creating...
            </>
          ) : (
            'Add Event'
          )}
        </button>
      </div>
    </form>
  );
}