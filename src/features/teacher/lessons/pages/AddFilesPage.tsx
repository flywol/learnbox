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
import LessonSuccessModal from '../components/LessonSuccessModal';

const addFilesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

type AddFilesData = z.infer<typeof addFilesSchema>;

export default function AddFilesPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdLessonData, setCreatedLessonData] = useState<{ title: string; lessonId?: string } | null>(null);
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
  } = useForm<AddFilesData>({
    resolver: zodResolver(addFilesSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  });

  // Check if we have pending lesson data from AddLessonPage
  useEffect(() => {
    const pendingLesson = sessionStorage.getItem('pendingLesson');
    if (!pendingLesson) {
      toast({
        title: "Missing Lesson Info",
        description: "Please start by adding lesson basic information.",
        variant: "destructive",
      });
      navigate(`/teacher/subject/${subjectId}/lesson/add`);
    }
  }, [subjectId, navigate, toast]);

  const handleSaveAndContinue = async (data: AddFilesData) => {
    if (files.length === 0) {
      toast({
        title: "File Required",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const pendingLessonStr = sessionStorage.getItem('pendingLesson');
      if (!pendingLessonStr || !subject) {
        throw new Error('Missing required lesson or subject data');
      }

      const pendingLesson = JSON.parse(pendingLessonStr);
      const classId = subject.classRef && typeof subject.classRef === 'object' ? subject.classRef._id : '';

      await lessonsApiClient.createLesson({
        title: pendingLesson.title,
        number: pendingLesson.number,
        startDate: pendingLesson.startDate,
        subject: subjectId!,
        class: classId,
        classArm: subject.classArm,
        contentType: 'file',
        contentTitle: data.title,
        contentDescription: data.description,
        file: files[0],
      });

      toast({
        title: "Success!",
        description: "Notes added successfully.",
        variant: "success",
      });

      navigate(`/teacher/subject/${subjectId}/lesson/add/content`);
    } catch (error: any) {
      console.error('Error creating lesson:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to add notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async (data: AddFilesData) => {
    if (files.length === 0) {
      toast({
        title: "File Required",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const pendingLessonStr = sessionStorage.getItem('pendingLesson');
      if (!pendingLessonStr || !subject) {
        throw new Error('Missing required lesson or subject data');
      }

      const pendingLesson = JSON.parse(pendingLessonStr);
      const classId = subject.classRef && typeof subject.classRef === 'object' ? subject.classRef._id : '';

      const response = await lessonsApiClient.createLesson({
        title: pendingLesson.title,
        number: pendingLesson.number,
        startDate: pendingLesson.startDate,
        subject: subjectId!,
        class: classId,
        classArm: subject.classArm,
        contentType: 'file',
        contentTitle: data.title,
        contentDescription: data.description,
        file: files[0],
      });

      sessionStorage.removeItem('pendingLesson');

      setCreatedLessonData({
        title: pendingLesson.title,
        lessonId: response.id,
      });
      setShowSuccessModal(true);
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
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles]);
      toast({
        title: "Files Added",
        description: `${droppedFiles.length} file(s) have been added.`,
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const fileArray = Array.from(selectedFiles);
      setFiles(prev => [...prev, ...fileArray]);
      toast({
        title: "Files Selected",
        description: `${fileArray.length} file(s) have been selected.`,
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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
        <h1 className="text-2xl font-bold text-gray-900">Add files</h1>
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

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSubmit(handleSaveAndContinue)}
                disabled={isSubmitting || files.length === 0}
                className="flex-1 px-6 py-3 bg-white border-2 border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? 'Saving...' : 'Save & Continue'}
              </button>
              <button
                type="button"
                onClick={handleSubmit(handlePublish)}
                disabled={isSubmitting || files.length === 0}
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </button>
            </div>
            {files.length === 0 && (
              <p className="mt-2 text-sm text-gray-500 text-center">
                Please upload at least one file to continue
              </p>
            )}
          </form>
        </div>

        {/* Right Side - File Upload */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Files</h3>
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
                  alt="Upload files" 
                  className="w-16 h-16"
                />
              </div>
              <div>
                <p className="text-gray-600">
                  Drag and drop or{' '}
                  <span className="text-orange-500 hover:text-orange-600 font-medium cursor-pointer">
                    select files
                  </span>{' '}
                  to upload
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Supports: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, Images
                </p>
              </div>
            </div>
          </div>
          
          {/* Files List */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Uploaded Files ({files.length})</h4>
              {files.map((file, index) => (
                <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-sm">📄</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-800">{file.name}</p>
                        <p className="text-xs text-green-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="text-green-600 hover:text-green-800 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.gif"
          />
        </div>
      </div>

      {/* Success Modal */}
      {createdLessonData && (
        <LessonSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          lessonTitle={createdLessonData.title}
          contentType="document"
          onAddMore={() => {
            setShowSuccessModal(false);
            navigate(`/teacher/subject/${subjectId}/lesson/add/content`);
          }}
          onViewLesson={() => {
            setShowSuccessModal(false);
            if (createdLessonData.lessonId) {
              navigate(`/teacher/subject/${subjectId}/lesson/${createdLessonData.lessonId}`);
            } else {
              navigate(`/teacher/subject/${subjectId}`);
            }
          }}
        />
      )}
    </div>
  );
}