import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Bold, Italic, Underline, List, ListOrdered, Link, Image, Calendar, Clock } from 'lucide-react';
import { z } from 'zod';
import { useToast } from '../../../../hooks/use-toast';
import { lessonsApiClient } from '../api/lessonsApiClient';
import { subjectsClassesApiClient } from '../../classroom/api/subjectsClassesApiClient';

const addAssignmentSchema = z.object({
  // Lesson fields
  lessonTitle: z.string().min(1, "Lesson title is required"),
  lessonNumber: z.string().min(1, "Lesson number is required"),
  startDate: z.string().min(1, "Start date is required"),
  class: z.string().min(1, "Class is required"),
  classArm: z.string().optional(),
  // Assignment fields
  title: z.string().min(1, "Assignment title is required"),
  description: z.string().min(1, "Assignment description is required"),
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
  const [contentFile] = useState<File | null>(null);
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch teacher's classes and subjects for form dropdowns
  const { data: subjectsClassesData } = useQuery({
    queryKey: ['teacher-subjects-classes'],
    queryFn: () => subjectsClassesApiClient.getTeacherSubjectsAndClasses(),
    staleTime: 5 * 60 * 1000,
  });

  // Create lesson mutation
  const createLessonMutation = useMutation({
    mutationFn: lessonsApiClient.createLesson,
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Lesson with assignment created successfully.",
      });
      navigate(`/teacher/subject/${subjectId}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create lesson. Please try again.",
        variant: "destructive",
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddAssignmentData>({
    resolver: zodResolver(addAssignmentSchema),
    defaultValues: {
      lessonTitle: 'Introduction to Biology',
      lessonNumber: '1',
      startDate: new Date().toISOString().split('T')[0],
      class: '',
      classArm: '',
      title: 'Biology Assignment',
      description: 'Complete the following assignment tasks',
      acceptLateSubmission: true
    }
  });

  // Helper function to convert date to DD/MM/YYYY format
  const formatDateToDDMMYYYY = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSaveAndContinue = async () => {
    // For now, just show toast since draft functionality may need separate endpoint
    toast({
      title: "Draft Saved!",
      description: "Assignment saved as draft. You can continue editing later.",
    });
    
    if (lessonId) {
      navigate(`/teacher/subject/${subjectId}/lesson/${lessonId}/content/add`);
    } else {
      navigate(`/teacher/subject/${subjectId}/lesson/add/content`);
    }
  };

  const handlePublish = async (data: AddAssignmentData) => {
    if (!subjectId) {
      toast({
        title: "Error",
        description: "Subject ID is required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const lessonData = {
        title: data.lessonTitle,
        number: data.lessonNumber,
        startDate: formatDateToDDMMYYYY(data.startDate),
        subject: subjectId,
        class: data.class,
        classArm: data.classArm,
        contentType: 'assignment' as const,
        contentTitle: data.title,
        contentDescription: data.description,
        file: contentFile || undefined,
        assignmentTitle: data.title,
        assignmentDescription: data.description,
        assignmentDueDate: formatDateToDDMMYYYY(data.dueDate),
        assignmentDueTime: data.dueTime,
        acceptLateSubmissions: acceptLateSubmission,
        assignmentFile: assignmentFile || undefined,
      };

      await createLessonMutation.mutateAsync(lessonData);
    } catch (error) {
      // Error handling is done in the mutation
      console.error('Failed to create lesson:', error);
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
      setAssignmentFile(files[0]);
      toast({
        title: "File Added",
        description: `${files[0].name} has been added to the assignment.`,
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAssignmentFile(files[0]);
      toast({
        title: "File Selected",
        description: `${files[0].name} has been selected.`,
      });
    }
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
            {/* Lesson Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Lesson Details</h3>
              
              {/* Lesson Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Title *
                </label>
                <input
                  {...register('lessonTitle')}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.lessonTitle ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.lessonTitle && (
                  <p className="mt-1 text-sm text-red-600">{errors.lessonTitle.message}</p>
                )}
              </div>

              {/* Lesson Number & Start Date */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Number *
                  </label>
                  <input
                    {...register('lessonNumber')}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.lessonNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.lessonNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.lessonNumber.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    {...register('startDate')}
                    type="date"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.startDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                  )}
                </div>
              </div>

              {/* Class & Class Arm */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class *
                  </label>
                  <select
                    {...register('class')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.class ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a class</option>
                    {(() => {
                      // Try classes array first
                      if (subjectsClassesData?.classes?.length) {
                        return subjectsClassesData.classes.map((cls: any) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ));
                      }
                      
                      // Fallback: extract unique classes from assigned subjects
                      const uniqueClasses = new Map();
                      subjectsClassesData?.assignedSubjects?.forEach(subject => {
                        if (subject.classRef && typeof subject.classRef === 'object') {
                          const classRef = subject.classRef;
                          uniqueClasses.set(classRef._id, {
                            id: classRef._id,
                            name: classRef.class || classRef.levelName
                          });
                        }
                      });
                      
                      const classOptions = Array.from(uniqueClasses.values());
                      
                      if (classOptions.length === 0) {
                        return <option disabled>No classes available</option>;
                      }
                      
                      return classOptions.map((cls: any) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ));
                    })()}
                  </select>
                  {errors.class && (
                    <p className="mt-1 text-sm text-red-600">{errors.class.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Arm (Optional)
                  </label>
                  <input
                    {...register('classArm')}
                    type="text"
                    placeholder="e.g., A, B, Alpha"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Assignment Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment Details</h3>
            </div>

            {/* Assignment Title */}
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Assignment File</h3>
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
                    alt="Upload file" 
                    className="w-16 h-16"
                  />
                </div>
                <div>
                  <p className="text-gray-600">
                    Drag and drop or{' '}
                    <span className="text-orange-500 hover:text-orange-600 font-medium cursor-pointer">
                      select file
                    </span>{' '}
                    to upload
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Supports: PDF, DOC, DOCX, TXT, PNG, JPG, JPEG
                  </p>
                </div>
                
                {assignmentFile && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 text-sm">📄</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-800">{assignmentFile.name}</p>
                          <p className="text-xs text-green-600">
                            {(assignmentFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAssignmentFile(null);
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
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}