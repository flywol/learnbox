import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { Clock, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { timetableApiClient } from '../api/timetableApiClient';
import { DAYS } from '../types/timetable.types';
import type { CreateTimetableRequest } from '../types/timetable.types';
import SuccessModal from '@/common/components/SuccessModal';

// Form type for the simplified design
type FormData = {
  classId: string;
  subjects: {
    id: string;
    subjectName: string;
    timeSlots: {
      id: string;
      day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | '';
      startTime: string;
      endTime: string;
    }[];
  }[];
};

// Generate unique ID for form items
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function AddTimetablePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get('classId') || '';
  const prefilledDay = searchParams.get('day') as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | null;
  const prefilledTime = searchParams.get('time') || '';
  const editSubjectName = searchParams.get('editSubject') || '';
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Fetch existing timetable data
  const { data: existingTimetable, isLoading: isTimetableLoading } = useQuery({
    queryKey: ['timetable', classId],
    queryFn: () => timetableApiClient.getTimetable(classId),
    enabled: !!classId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Convert time format from "08:00am" to "08:00"
  const convertTimeFormat = (time: string): string => {
    if (!time) return '';
    // Remove am/pm and convert to 24-hour format
    const match = time.match(/^(\d{1,2}):(\d{2})(am|pm)$/);
    if (!match) return time; // Already in correct format
    
    const [, hours, minutes, period] = match;
    let hour24 = parseInt(hours, 10);
    
    if (period.toLowerCase() === 'pm' && hour24 !== 12) {
      hour24 += 12;
    } else if (period.toLowerCase() === 'am' && hour24 === 12) {
      hour24 = 0;
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minutes}`;
  };

  const convertedPrefilledTime = convertTimeFormat(prefilledTime);

  // Determine if we're editing or adding
  const isEditing = !!existingTimetable;
  const isQuickAdd = !!(prefilledDay && convertedPrefilledTime);
  const pageTitle = isEditing ? 'Edit timetable' : isQuickAdd ? 'Add subject' : 'Add timetable';

  // Initialize form with one subject and one time slot
  const { control, register, handleSubmit, watch, setValue, reset } = useForm<FormData>({
    defaultValues: {
      classId,
      subjects: [{
        id: generateId(),
        subjectName: editSubjectName, // Pre-fill subject name if editing
        timeSlots: [{
          id: generateId(),
          day: prefilledDay || '',
          startTime: convertedPrefilledTime,
          endTime: convertedPrefilledTime ? 
            // Auto-calculate end time (1 hour later)
            (() => {
              const [hours, minutes] = convertedPrefilledTime.split(':');
              const endHour = parseInt(hours) + 1;
              return endHour <= 15 ? `${endHour.toString().padStart(2, '0')}:${minutes}` : '';
            })() : ''
        }]
      }]
    }
  });

  // Pre-populate form when existing timetable data loads
  useEffect(() => {
    if (existingTimetable && existingTimetable.subjectSchedules.length > 0) {
      const formData: FormData = {
        classId,
        subjects: existingTimetable.subjectSchedules.map(schedule => ({
          id: generateId(),
          subjectName: schedule.subjectName,
          timeSlots: schedule.schedule.map(slot => ({
            id: generateId(),
            day: slot.day,
            startTime: slot.startTime,
            endTime: slot.endTime
          }))
        }))
      };
      
      reset(formData);
    }
  }, [existingTimetable, classId, reset]);

  // Field array for dynamic subjects
  const { fields: subjectFields, append: appendSubject, remove: removeSubject } = useFieldArray({
    control,
    name: 'subjects'
  });

  // Mutation for creating timetable
  const createTimetableMutation = useMutation({
    mutationFn: (data: CreateTimetableRequest) => timetableApiClient.createTimetable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable', classId] });
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error('Error creating timetable:', error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  // Handle form submission
  const onFormSubmit = (data: FormData) => {
    setIsSubmitting(true);
    
    // Transform form data to API format
    const apiData: CreateTimetableRequest = {
      classId: data.classId,
      subjectSchedules: data.subjects
        .filter(subject => subject.subjectName.trim())
        .map(subject => ({
          subjectName: subject.subjectName,
          schedule: subject.timeSlots
            .filter(slot => slot.day && slot.startTime && slot.endTime)
            .map(slot => ({
              day: slot.day as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday',
              startTime: slot.startTime,
              endTime: slot.endTime
            }))
        }))
        .filter(subject => subject.schedule.length > 0)
    };
    
    createTimetableMutation.mutate(apiData);
  };

  // Add new subject
  const handleAddSubject = () => {
    appendSubject({
      id: generateId(),
      subjectName: '',
      timeSlots: [{
        id: generateId(),
        day: '',
        startTime: '',
        endTime: ''
      }]
    });
  };

  // Add time slot to a subject
  const handleAddTimeSlot = (subjectIndex: number) => {
    const currentSubject = watch(`subjects.${subjectIndex}`);
    const newTimeSlots = [...currentSubject.timeSlots, {
      id: generateId(),
      day: '' as const,
      startTime: '',
      endTime: ''
    }];
    setValue(`subjects.${subjectIndex}.timeSlots`, newTimeSlots as any);
  };

  // Remove time slot from a subject
  const handleRemoveTimeSlot = (subjectIndex: number, timeSlotIndex: number) => {
    const currentSubject = watch(`subjects.${subjectIndex}`);
    if (currentSubject.timeSlots.length > 1) {
      const newTimeSlots = currentSubject.timeSlots.filter((_, index) => index !== timeSlotIndex);
      setValue(`subjects.${subjectIndex}.timeSlots`, newTimeSlots as any);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/classroom?tab=schedule&subtab=timetable');
  };

  // Show loading state while fetching existing timetable
  if (isTimetableLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading timetable...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleCancel = () => {
    navigate('/classroom?tab=schedule&subtab=timetable');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-lg font-medium">{pageTitle}</span>
        </button>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Dynamic Subjects */}
          {subjectFields.map((subject, subjectIndex) => (
            <div key={subject.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              {/* Subject Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  {...register(`subjects.${subjectIndex}.subjectName`)}
                  type="text"
                  placeholder="Input text"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  disabled={isSubmitting}
                />
              </div>

              {/* Time Slots */}
              <div className="space-y-4">
                {watch(`subjects.${subjectIndex}.timeSlots`)?.map((timeSlot, timeSlotIndex) => (
                  <div key={timeSlot.id} className="grid grid-cols-12 gap-4 items-start">
                    {/* Day Selection */}
                    <div className="col-span-4">
                      <select
                        {...register(`subjects.${subjectIndex}.timeSlots.${timeSlotIndex}.day`)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        disabled={isSubmitting}
                      >
                        <option value="">Day</option>
                        {DAYS.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Start Time */}
                    <div className="col-span-3 relative">
                      <input
                        {...register(`subjects.${subjectIndex}.timeSlots.${timeSlotIndex}.startTime`)}
                        type="time"
                        min="08:00"
                        max="15:00"
                        placeholder="Schedule start time"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                        disabled={isSubmitting}
                      />
                      <Clock className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    
                    {/* End Time */}
                    <div className="col-span-3 relative">
                      <input
                        {...register(`subjects.${subjectIndex}.timeSlots.${timeSlotIndex}.endTime`)}
                        type="time"
                        min="08:00"
                        max="15:00"
                        placeholder="Schedule end time"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                        disabled={isSubmitting}
                      />
                      <Clock className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="col-span-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddTimeSlot(subjectIndex)}
                        className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors"
                        disabled={isSubmitting}
                        title="Add time slot"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      {watch(`subjects.${subjectIndex}.timeSlots`).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTimeSlot(subjectIndex, timeSlotIndex)}
                          className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors"
                          disabled={isSubmitting}
                          title="Remove time slot"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Remove Subject Button (only show if more than 1 subject) */}
              {subjectFields.length > 1 && (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeSubject(subjectIndex)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                    disabled={isSubmitting}
                  >
                    Remove Subject
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add Subject Button */}
          <button
            type="button"
            onClick={handleAddSubject}
            className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors"
            disabled={isSubmitting}
            title="Add another subject"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Submit Button */}
          <div className="pt-6">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Update timetable' : 'Save timetable'}</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Success!"
        message={isEditing ? "Timetable updated successfully!" : "Timetable created successfully!"}
        buttonText="Continue"
      />
    </div>
  );
}