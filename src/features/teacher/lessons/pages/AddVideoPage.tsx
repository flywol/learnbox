import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Link } from 'lucide-react';
import { z } from 'zod';
import { useToast } from '../../../../hooks/use-toast';
import { lessonsApiClient } from '../api/lessonsApiClient';
import { useQuery } from '@tanstack/react-query';
import { subjectsClassesApiClient } from '../../classroom/api/subjectsClassesApiClient';

const addVideoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

type AddVideoData = z.infer<typeof addVideoSchema>;

export default function AddVideoPage() {
  const { subjectId, lessonId } = useParams<{ subjectId: string; lessonId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get subject data to extract class and classArm info
  const { data: subjectsData } = useQuery({
    queryKey: ['teacher-subjects-classes'],
    queryFn: () => subjectsClassesApiClient.getTeacherSubjectsAndClasses(),
    staleTime: 5 * 60 * 1000,
  });

  const subject = subjectsData?.assignedSubjects.find(s => s._id === subjectId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddVideoData>({
    resolver: zodResolver(addVideoSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  });

  // Check if we have pending lesson data from AddLessonPage
  useEffect(() => {
    if (!lessonId) {
      const pendingLesson = sessionStorage.getItem('pendingLesson');
      if (!pendingLesson) {
        toast({
          title: "Missing Lesson Info",
          description: "Please start by adding lesson basic information.",
          variant: "destructive",
        });
        navigate(`/teacher/subject/${subjectId}/lesson/add`);
      }
    }
  }, [lessonId, subjectId, navigate, toast]);

  const handlePublish = async (data: AddVideoData) => {
    if (!videoFile) {
      toast({
        title: "Video Required",
        description: "Please select a video file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (lessonId) {
        // TODO: Update existing lesson
        toast({
          title: "Not Implemented",
          description: "Updating existing lessons is not yet implemented.",
          variant: "destructive",
        });
        return;
      } else {
        // Create new lesson with video content
        const pendingLessonStr = sessionStorage.getItem('pendingLesson');
        if (!pendingLessonStr || !subject) {
          throw new Error('Missing required lesson or subject data');
        }

        const pendingLesson = JSON.parse(pendingLessonStr);

        // Extract class info from subject
        const classId = subject.classRef && typeof subject.classRef === 'object' ? subject.classRef._id : '';

        await lessonsApiClient.createLesson({
          title: pendingLesson.title,
          number: pendingLesson.number,
          startDate: pendingLesson.startDate,
          subject: subjectId!,
          class: classId,
          classArm: subject.classArm,
          contentType: 'video',
          contentTitle: data.title,
          contentDescription: data.description,
          file: videoFile,
        });

        // Clear pending lesson data
        sessionStorage.removeItem('pendingLesson');
      }

      toast({
        title: "Success!",
        description: "Lesson with video content has been created successfully.",
        variant: "success",
      });

      // Navigate to subject detail page
      navigate(`/teacher/subject/${subjectId}`);
    } catch (error: any) {
      console.error('Error creating lesson:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to create lesson. Please try again.",
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
    if (files.length > 0) {
      setVideoFile(files[0]);
      toast({
        title: "Video Added",
        description: `${files[0].name} has been added.`,
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setVideoFile(files[0]);
      toast({
        title: "Video Selected",
        description: `${files[0].name} has been selected.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            if (lessonId) {
              navigate(`/teacher/subject/${subjectId}/lesson/${lessonId}/content/add`);
            } else {
              navigate(`/teacher/subject/${subjectId}/lesson/add/content`);
            }
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add video</h1>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Form */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
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

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <div className="relative">
                <textarea
                  {...register('description')}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  className="absolute bottom-3 left-3 p-1 text-gray-400 hover:text-gray-600"
                >
                  <Link className="w-4 h-4" />
                </button>
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Action Button */}
            <div>
              <button
                type="button"
                onClick={handleSubmit(handlePublish)}
                disabled={isSubmitting || !videoFile}
                className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Creating Lesson...' : 'Create Lesson'}
              </button>
              {!videoFile && (
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Please upload a video file to continue
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Right Side - File Upload */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Video</h3>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragging 
                ? 'border-orange-400 bg-orange-50' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <img 
                  src="/assets/upload.svg" 
                  alt="Upload video" 
                  className="w-16 h-16"
                />
              </div>
              <div>
                <p className="text-gray-600">
                  Drag and drop or{' '}
                  <span className="text-orange-500 hover:text-orange-600 font-medium cursor-pointer">
                    select video
                  </span>{' '}
                  to upload
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Supports: MP4, AVI, MOV, WMV, FLV
                </p>
              </div>
              
              {videoFile && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-sm">🎬</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-800">{videoFile.name}</p>
                        <p className="text-xs text-green-600">
                          {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoFile(null);
                      }}
                      className="text-green-600 hover:text-green-800 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="video/*,.mp4,.avi,.mov,.wmv,.flv"
          />
        </div>
      </div>
    </div>
  );
}