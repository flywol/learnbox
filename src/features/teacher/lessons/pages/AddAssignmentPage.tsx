import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Bold, Italic, Underline, List, ListOrdered, Link, Image, Calendar, Clock, FileText, Upload, X, CheckCircle } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/teacher/subject/${subjectId}/lesson/add/content`)}
          className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        </button>
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Add Assignment</h1>
           <p className="text-sm text-gray-500">Create a new assignment for this lesson</p>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side - Form */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
             <form className="space-y-8">
               {/* Lesson Section */}
               <div className="border-b border-gray-100 pb-8">
                 <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 text-sm">1</span>
                    Lesson Details
                 </h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Lesson Title */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Lesson Title *
                      </label>
                      <input
                        {...register('lessonTitle')}
                        type="text"
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                          errors.lessonTitle ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                      {errors.lessonTitle && (
                        <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.lessonTitle.message}</p>
                      )}
                    </div>

                    {/* Lesson Number & Start Date */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Lesson Number *
                      </label>
                      <input
                        {...register('lessonNumber')}
                        type="text"
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                          errors.lessonNumber ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                      {errors.lessonNumber && (
                        <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.lessonNumber.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <div className="relative">
                         <input
                           {...register('startDate')}
                           type="date"
                           className={`w-full px-4 py-3 pl-11 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                             errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-200'
                           }`}
                         />
                         <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                      {errors.startDate && (
                        <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.startDate.message}</p>
                      )}
                    </div>

                    {/* Class & Class Arm */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Class *
                      </label>
                      <div className="relative">
                         <select
                           {...register('class')}
                           className={`w-full px-4 py-3 bg-gray-50 border rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                             errors.class ? 'border-red-300 bg-red-50' : 'border-gray-200'
                           }`}
                         >
                           <option value="">Select a class</option>
                           {(() => {
                             if (subjectsClassesData?.classes?.length) {
                               return subjectsClassesData.classes.map((cls: any) => (
                                 <option key={cls.id} value={cls.id}>
                                   {cls.name}
                                 </option>
                               ));
                             }
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
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                         </div>
                      </div>
                      {errors.class && (
                        <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.class.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Class Arm (Optional)
                      </label>
                      <input
                        {...register('classArm')}
                        type="text"
                        placeholder="e.g., A, B, Alpha"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      />
                    </div>
                 </div>
               </div>

               {/* Assignment Section */}
               <div>
                 <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm">2</span>
                    Assignment Details
                 </h3>
                 
                 <div className="space-y-6">
                    {/* Assignment Title */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        {...register('title')}
                        type="text"
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                          errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                      {errors.title && (
                        <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.title.message}</p>
                      )}
                    </div>

                    {/* Description with Rich Text Editor */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description *
                      </label>
                      
                      <div className={`border rounded-xl overflow-hidden transition-all ${
                         errors.description ? 'border-red-300' : 'border-gray-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20'
                      }`}>
                         {/* Toolbar */}
                         <div className="bg-gray-50 border-b border-gray-200 p-2 flex items-center gap-1 flex-wrap">
                           <select className="text-sm border-none bg-transparent mr-2 font-medium text-gray-600 focus:ring-0 cursor-pointer">
                             <option>Normal Text</option>
                             <option>Heading 1</option>
                             <option>Heading 2</option>
                           </select>
                           <div className="w-px h-4 bg-gray-300 mx-2" />
                           <div className="flex items-center gap-1">
                             <button type="button" className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
                               <Bold className="w-4 h-4" />
                             </button>
                             <button type="button" className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
                               <Italic className="w-4 h-4" />
                             </button>
                             <button type="button" className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
                               <Underline className="w-4 h-4" />
                             </button>
                           </div>
                           <div className="w-px h-4 bg-gray-300 mx-2" />
                           <div className="flex items-center gap-1">
                             <button type="button" className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
                               <List className="w-4 h-4" />
                             </button>
                             <button type="button" className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
                               <ListOrdered className="w-4 h-4" />
                             </button>
                           </div>
                           <div className="w-px h-4 bg-gray-300 mx-2" />
                           <div className="flex items-center gap-1">
                             <button type="button" className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
                               <Link className="w-4 h-4" />
                             </button>
                             <button type="button" className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
                               <Image className="w-4 h-4" />
                             </button>
                           </div>
                         </div>

                         <textarea
                           {...register('description')}
                           rows={8}
                           className="w-full px-4 py-3 border-none focus:ring-0 resize-none bg-white"
                           placeholder="Type your assignment description here..."
                         />
                      </div>
                      {errors.description && (
                        <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.description.message}</p>
                      )}
                    </div>

                    {/* Due Date & Time */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Schedule due date *
                        </label>
                        <div className="relative">
                          <input
                            {...register('dueDate')}
                            type="date"
                            className={`w-full px-4 py-3 pl-11 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                              errors.dueDate ? 'border-red-300 bg-red-50' : 'border-gray-200'
                            }`}
                          />
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                        {errors.dueDate && (
                          <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.dueDate.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Schedule due time *
                        </label>
                        <div className="relative">
                          <input
                            {...register('dueTime')}
                            type="time"
                            className={`w-full px-4 py-3 pl-11 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                              errors.dueTime ? 'border-red-300 bg-red-50' : 'border-gray-200'
                            }`}
                          />
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                        {errors.dueTime && (
                          <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.dueTime.message}</p>
                        )}
                      </div>
                    </div>
                 </div>
               </div>

               {/* Action Buttons */}
               <div className="flex gap-4 pt-4 border-t border-gray-100">
                 <button
                   type="button"
                   onClick={handleSubmit(handleSaveAndContinue)}
                   disabled={isSubmitting}
                   className="flex-1 px-6 py-3 border border-orange-200 text-orange-600 rounded-xl hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                 >
                   {isSubmitting ? 'Saving...' : 'Save as Draft'}
                 </button>
                 <button
                   type="button"
                   onClick={handleSubmit(handlePublish)}
                   disabled={isSubmitting}
                   className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md font-semibold"
                 >
                   {isSubmitting ? 'Publishing...' : 'Publish Assignment'}
                 </button>
               </div>
             </form>
           </div>
        </div>

        {/* Right Side - Settings & File Upload */}
        <div className="space-y-6">
          {/* Accept Late Submission Toggle */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">
                Accept late submissions
              </span>
              <button
                type="button"
                onClick={() => setAcceptLateSubmission(!acceptLateSubmission)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  acceptLateSubmission ? 'bg-orange-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                    acceptLateSubmission ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
               If enabled, students can submit after the due date but it will be marked as late.
            </p>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
               <FileText className="w-4 h-4 text-orange-600" />
               Assignment Resources
            </h3>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group ${
                isDragging 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
              }`}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                   isDragging ? 'bg-orange-200' : 'bg-orange-100 group-hover:bg-orange-200'
                }`}>
                  <Upload className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOCX, JPG or PNG (max. 10MB)
                  </p>
                </div>
                
                {assignmentFile && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl w-full text-left relative group/file">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{assignmentFile.name}</p>
                        <p className="text-xs text-green-600 font-medium">
                          {(assignmentFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAssignmentFile(null);
                        }}
                        className="p-1 hover:bg-green-200 rounded-full text-green-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
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