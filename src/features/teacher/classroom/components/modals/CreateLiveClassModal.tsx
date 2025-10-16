import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, Video } from 'lucide-react';
import Modal from '@/common/components/Modal';
import { useCreateLiveClass } from '../../hooks/useLiveClasses';
import { transformFormToRequest, isValidGoogleMeetLink } from '../../utils/liveClassUtils';
import type { LiveClassFormData } from '../../types/liveClass.types';

// Validation schema
const liveClassSchema = z.object({
  subjectId: z.string().min(1, 'Please select a subject'),
  subjectName: z.string().min(1, 'Subject name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  durationHours: z.number().min(0).max(5, 'Maximum 5 hours'),
  durationMinutes: z.number().min(0).max(59),
  classLink: z.string().url('Must be a valid URL').refine(
    isValidGoogleMeetLink,
    'Must be a valid Google Meet link (https://meet.google.com/xxx-xxxx-xxx)'
  ),
  meetingId: z.string().optional(),
}).refine(
  (data) => data.durationHours > 0 || data.durationMinutes > 0,
  {
    message: 'Duration must be at least 1 minute',
    path: ['durationMinutes'],
  }
);

interface CreateLiveClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Array<{ id: string; name: string }>; // Teacher's assigned subjects
  preSelectedSubjectId?: string; // If opened from subject detail page
}

export default function CreateLiveClassModal({
  isOpen,
  onClose,
  subjects,
  preSelectedSubjectId,
}: CreateLiveClassModalProps) {
  const createMutation = useCreateLiveClass();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<LiveClassFormData>({
    resolver: zodResolver(liveClassSchema),
    defaultValues: {
      subjectId: preSelectedSubjectId || '',
      subjectName: '',
      description: '',
      date: '',
      time: '',
      durationHours: 1,
      durationMinutes: 0,
      classLink: '',
      meetingId: '',
    },
  });

  // Update subject name when subject is selected
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subjectId = e.target.value;
    const subject = subjects.find(s => s.id === subjectId);
    setValue('subjectId', subjectId);
    setValue('subjectName', subject?.name || '');
  };

  const onSubmit = async (data: LiveClassFormData) => {
    const requestData = transformFormToRequest(data);

    await createMutation.mutateAsync({
      subjectId: data.subjectId,
      data: requestData,
    });

    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Live Class">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Subject Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <select
            {...register('subjectId')}
            onChange={handleSubjectChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={!!preSelectedSubjectId}
          >
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjectId && (
            <p className="mt-1 text-sm text-red-600">{errors.subjectId.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Brief description of what will be covered in this class"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register('date')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              {...register('time')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {errors.time && (
              <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
            )}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Hours</label>
              <input
                type="number"
                {...register('durationHours', { valueAsNumber: true })}
                min="0"
                max="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Minutes</label>
              <input
                type="number"
                {...register('durationMinutes', { valueAsNumber: true })}
                min="0"
                max="59"
                step="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          {errors.durationMinutes && (
            <p className="mt-1 text-sm text-red-600">{errors.durationMinutes.message}</p>
          )}
        </div>

        {/* Google Meet Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Video className="w-4 h-4 inline mr-1" />
            Google Meet Link <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            {...register('classLink')}
            placeholder="https://meet.google.com/xxx-xxxx-xxx"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          {errors.classLink && (
            <p className="mt-1 text-sm text-red-600">{errors.classLink.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Create a meeting at{' '}
            <a
              href="https://meet.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              meet.google.com
            </a>{' '}
            and paste the link here
          </p>
        </div>

        {/* Meeting ID (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meeting ID <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="text"
            {...register('meetingId')}
            placeholder="Your reference ID for this meeting"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Optional reference ID for your records
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Live Class'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
