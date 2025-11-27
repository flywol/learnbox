import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { z } from 'zod';

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddLessonData>({
    resolver: zodResolver(addLessonSchema),
  });

  const onSubmit = (data: AddLessonData) => {
    // Store lesson basic info in sessionStorage to be used when creating the lesson with content
    sessionStorage.setItem('pendingLesson', JSON.stringify({
      title: data.title,
      number: data.lessonNumber,
      startDate: data.scheduleStartDate,
      scheduleTime: data.scheduleTime,
    }));

    // Navigate to content selection - the actual API call will happen when content is added
    navigate(`/teacher/subject/${subjectId}/lesson/add/content`);
  };

  const lessonNumbers = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/teacher/subject/${subjectId}`)}
          className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        </button>
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Add New Lesson</h1>
           <p className="text-sm text-gray-500">Create a new lesson for your students</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
           <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
              Lesson Details
           </h2>
           
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Lesson Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lesson title *
              </label>
              <input
                {...register('title')}
                type="text"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="e.g. Introduction to Photosynthesis"
              />
              {errors.title && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.title.message}</p>
              )}
            </div>

            {/* Lesson Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lesson number *
              </label>
              <div className="relative">
                 <select
                   {...register('lessonNumber')}
                   className={`w-full px-4 py-3 bg-gray-50 border rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                     errors.lessonNumber ? 'border-red-300 bg-red-50' : 'border-gray-200'
                   }`}
                 >
                   <option value="">Select number</option>
                   {lessonNumbers.map(num => (
                     <option key={num} value={num.toString()}>
                       Lesson {num}
                     </option>
                   ))}
                 </select>
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                 </div>
              </div>
              {errors.lessonNumber && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.lessonNumber.message}</p>
              )}
            </div>

            {/* Schedule Start Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Schedule start date *
              </label>
              <div className="relative">
                <input
                  {...register('scheduleStartDate')}
                  type="date"
                  className={`w-full px-4 py-3 pl-11 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                    errors.scheduleStartDate ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.scheduleStartDate && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.scheduleStartDate.message}</p>
              )}
            </div>

            {/* Schedule Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Schedule time *
              </label>
              <div className="relative">
                <input
                  {...register('scheduleTime')}
                  type="time"
                  className={`w-full px-4 py-3 pl-11 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                    errors.scheduleTime ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.scheduleTime && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.scheduleTime.message}</p>
              )}
            </div>
          </div>

          {/* Note */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
             <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">i</span>
             </div>
            <p className="text-sm text-blue-700">
              Please note: Lessons will be locked for students until the scheduled start date and time.
            </p>
          </div>

          {/* Continue Button */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-sm hover:shadow-md font-semibold flex items-center gap-2"
            >
              Continue to Add Content
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}