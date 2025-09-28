import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { z } from 'zod';
import { useToast } from '../../../../hooks/use-toast';

const addLessonSchema = z.object({
  title: z.string().min(1, "Lesson title is required"),
  lessonNumber: z.string().min(1, "Lesson number is required"),
  scheduleStartDate: z.string().min(1, "Schedule start date is required"),
  scheduleTime: z.string().min(1, "Schedule time is required"),
});

type AddLessonData = z.infer<typeof addLessonSchema>;

export default function AddLessonPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddLessonData>({
    resolver: zodResolver(addLessonSchema),
  });

  const onSubmit = async (data: AddLessonData) => {
    setIsSubmitting(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Creating lesson:', data);
      
      toast({
        title: "Success!",
        description: "Lesson created successfully. You can now add content to your lesson.",
      });
      
      // Navigate to lesson content selection
      navigate(`/teacher/subject/${subjectId}/lesson/add/content`);
    } catch {
      toast({
        title: "Error",
        description: "Failed to create lesson. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const lessonNumbers = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/teacher/subject/${subjectId}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Lesson</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lesson Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson title *
              </label>
              <input
                {...register('title')}
                type="text"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter lesson title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Lesson Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson number *
              </label>
              <select
                {...register('lessonNumber')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.lessonNumber ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select lesson number</option>
                {lessonNumbers.map(num => (
                  <option key={num} value={num.toString()}>
                    Lesson {num}
                  </option>
                ))}
              </select>
              {errors.lessonNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.lessonNumber.message}</p>
              )}
            </div>

            {/* Schedule Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule start date *
              </label>
              <div className="relative">
                <input
                  {...register('scheduleStartDate')}
                  type="date"
                  className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.scheduleStartDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.scheduleStartDate && (
                <p className="mt-1 text-sm text-red-600">{errors.scheduleStartDate.message}</p>
              )}
            </div>

            {/* Schedule Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule time *
              </label>
              <div className="relative">
                <input
                  {...register('scheduleTime')}
                  type="time"
                  className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.scheduleTime ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <Clock className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.scheduleTime && (
                <p className="mt-1 text-sm text-red-600">{errors.scheduleTime.message}</p>
              )}
            </div>
          </div>

          {/* Note */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Please note: Lessons will be locked pending scheduled start date.
            </p>
          </div>

          {/* Save Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}