import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Bold, Italic, Underline, List, ListOrdered, Link, Image, Calendar, Clock, Upload } from 'lucide-react';
import { z } from 'zod';
import { useToast } from '../../../../hooks/use-toast';

const addAssignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().min(1, "Due date is required"),
  dueTime: z.string().min(1, "Due time is required"),
  acceptLateSubmission: z.boolean().optional(),
});

type AddAssignmentData = z.infer<typeof addAssignmentSchema>;

export default function AddAssignmentPage() {
  const { subjectId, lessonId } = useParams<{ subjectId: string; lessonId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [acceptLateSubmission, setAcceptLateSubmission] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddAssignmentData>({
    resolver: zodResolver(addAssignmentSchema),
    defaultValues: {
      title: 'Introduction to biology',
      description: 'Input detailed instruction for students',
      acceptLateSubmission: true
    }
  });

  const handleSaveAndContinue = async (data: AddAssignmentData) => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving assignment as draft:', { ...data, acceptLateSubmission });
      
      toast({
        title: "Draft Saved!",
        description: "Assignment saved as draft. You can continue editing later.",
      });
      
      // Navigate based on whether we're adding to existing lesson or creating new
      if (lessonId) {
        navigate(`/teacher/subject/${subjectId}/lesson/${lessonId}/content/add`);
      } else {
        navigate(`/teacher/subject/${subjectId}/lesson/add/content`);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async (data: AddAssignmentData) => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Publishing assignment:', { ...data, acceptLateSubmission });
      
      toast({
        title: "Published!",
        description: "Assignment has been published successfully.",
      });
      
      // Navigate based on whether we're adding to existing lesson or creating new
      if (lessonId) {
        navigate(`/teacher/subject/${subjectId}/lesson/${lessonId}`);
      } else {
        navigate(`/teacher/subject/${subjectId}`);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to publish assignment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    console.log('Dropped files:', files);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/teacher/subject/${subjectId}/lesson/add/content`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add assignment</h1>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Form */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-6">
          <form className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                {...register('title')}
                type="text"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description with Rich Text Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              
              {/* Toolbar */}
              <div className="border border-gray-300 rounded-t-md p-2 bg-gray-50 flex items-center gap-1">
                <select className="text-sm border-none bg-transparent mr-2">
                  <option>Font</option>
                </select>
                <select className="text-sm border-none bg-transparent mr-2">
                  <option>Size</option>
                </select>
                <div className="flex items-center gap-1 ml-2 border-l pl-2">
                  <button type="button" className="p-1 hover:bg-gray-200 rounded">
                    <Bold className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded">
                    <Italic className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded">
                    <Underline className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1 ml-2 border-l pl-2">
                  <button type="button" className="p-1 hover:bg-gray-200 rounded">
                    <List className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded">
                    <ListOrdered className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1 ml-2 border-l pl-2">
                  <button type="button" className="p-1 hover:bg-gray-200 rounded">
                    <Link className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded">
                    <Image className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <textarea
                {...register('description')}
                rows={6}
                className={`w-full px-3 py-2 border border-t-0 rounded-b-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule due date *
              </label>
              <div className="relative">
                <input
                  {...register('dueDate')}
                  type="date"
                  className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.dueDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
              )}
            </div>

            {/* Due Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule due time *
              </label>
              <div className="relative">
                <input
                  {...register('dueTime')}
                  type="time"
                  className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.dueTime ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <Clock className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.dueTime && (
                <p className="mt-1 text-sm text-red-600">{errors.dueTime.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSubmit(handleSaveAndContinue)}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Saving...' : 'Save & Continue'}
              </button>
              <button
                type="button"
                onClick={handleSubmit(handlePublish)}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side - Settings & File Upload */}
        <div className="space-y-6">
          {/* Accept Late Submission Toggle */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Accept submission after due date:
              </span>
              <button
                type="button"
                onClick={() => setAcceptLateSubmission(!acceptLateSubmission)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  acceptLateSubmission ? 'bg-orange-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    acceptLateSubmission ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                  ? 'border-orange-400 bg-orange-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img 
                    src="/assets/upload.svg" 
                    alt="Upload" 
                    className="w-16 h-16"
                    onError={(e) => {
                      // Fallback to icon if SVG not found
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center hidden">
                    <Upload className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">
                    Drag and drop or{' '}
                    <button className="text-orange-500 hover:text-orange-600 underline">
                      select file
                    </button>{' '}
                    to upload
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}