import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Clock, Plus, Minus, AlertCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetableApiClient } from '../../api/timetableApiClient';
import { DAYS, SUBJECT_COLORS } from '../../types/timetable.types';
import type { CreateTimetableRequest } from '../../types/timetable.types';

interface AddTimetableFormProps {
  classId: string;
  onCancel: () => void;
  onSubmit: () => void;
}

// Form type that allows empty string for day during editing
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

export default function AddTimetableForm({ classId, onCancel, onSubmit }: AddTimetableFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const queryClient = useQueryClient();

  // Initialize form with default values
  const { control, register, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      classId,
      subjects: [{
        id: generateId(),
        subjectName: '',
        timeSlots: [{
          id: generateId(),
          day: '',
          startTime: '',
          endTime: ''
        }]
      }]
    }
  });

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
      onSubmit();
    },
    onError: (error) => {
      console.error('Error creating timetable:', error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  // Validate form data
  const validateForm = (data: FormData): string[] => {
    const errors: string[] = [];
    
    if (data.subjects.length === 0) {
      errors.push('At least one subject is required');
    }
    
    data.subjects.forEach((subject, subjectIndex) => {
      if (!subject.subjectName.trim()) {
        errors.push(`Subject ${subjectIndex + 1}: Name is required`);
      }
      
      if (subject.timeSlots.length === 0) {
        errors.push(`Subject ${subjectIndex + 1}: At least one time slot is required`);
      }
      
      subject.timeSlots.forEach((slot, slotIndex) => {
        if (!slot.day) {
          errors.push(`Subject ${subjectIndex + 1}, Time slot ${slotIndex + 1}: Day is required`);
        }
        if (!slot.startTime) {
          errors.push(`Subject ${subjectIndex + 1}, Time slot ${slotIndex + 1}: Start time is required`);
        }
        if (!slot.endTime) {
          errors.push(`Subject ${subjectIndex + 1}, Time slot ${slotIndex + 1}: End time is required`);
        }
        if (slot.startTime && slot.endTime && slot.startTime >= slot.endTime) {
          errors.push(`Subject ${subjectIndex + 1}, Time slot ${slotIndex + 1}: End time must be after start time`);
        }
      });
    });
    
    return errors;
  };

  // Handle form submission
  const onFormSubmit = (data: FormData) => {
    setValidationErrors([]);
    const errors = validateForm(data);
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Transform form data to API format
    const apiData: CreateTimetableRequest = {
      classId: data.classId,
      subjectSchedules: data.subjects.map(subject => ({
        subjectName: subject.subjectName,
        schedule: subject.timeSlots
          .filter(slot => slot.day && slot.startTime && slot.endTime)
          .map(slot => ({
            day: slot.day as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday',
            startTime: slot.startTime,
            endTime: slot.endTime
          }))
      })).filter(subject => subject.schedule.length > 0)
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

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="grid grid-cols-3 items-center sticky top-0 bg-white z-10 pb-4">
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isSubmitting}
        >
          ←
        </button>
        <h3 className="text-xl font-semibold text-center">Add Timetable</h3>
        <div />
      </div>

      {/* Error Display */}
      {(validationErrors.length > 0 || createTimetableMutation.error) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Please fix the following errors:</span>
          </div>
          <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
            {createTimetableMutation.error && (
              <li>{(createTimetableMutation.error as any)?.message || 'Failed to save timetable'}</li>
            )}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Dynamic Subjects */}
        {subjectFields.map((subject, subjectIndex) => {
          const subjectColor = SUBJECT_COLORS[subjectIndex % SUBJECT_COLORS.length];
          
          return (
            <div key={subject.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
              {/* Subject Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${subjectColor.split(' ')[0]}`} />
                  <span className="font-medium text-gray-700">Subject {subjectIndex + 1}</span>
                </div>
                {subjectFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubject(subjectIndex)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    disabled={isSubmitting}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Subject Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Name *
                </label>
                <input
                  {...register(`subjects.${subjectIndex}.subjectName`)}
                  type="text"
                  placeholder="Enter subject name (e.g., Mathematics)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>

              {/* Time Slots */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Schedule *
                </label>
                
                {watch(`subjects.${subjectIndex}.timeSlots`)?.map((timeSlot, timeSlotIndex) => (
                  <div key={timeSlot.id} className="grid grid-cols-4 gap-3 items-start">
                    {/* Day Selection */}
                    <div>
                      <select
                        {...register(`subjects.${subjectIndex}.timeSlots.${timeSlotIndex}.day`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        disabled={isSubmitting}
                      >
                        <option value="">Select Day</option>
                        {DAYS.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Start Time */}
                    <div className="relative">
                      <input
                        {...register(`subjects.${subjectIndex}.timeSlots.${timeSlotIndex}.startTime`)}
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-8 text-sm"
                        disabled={isSubmitting}
                      />
                      <Clock className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    
                    {/* End Time */}
                    <div className="relative">
                      <input
                        {...register(`subjects.${subjectIndex}.timeSlots.${timeSlotIndex}.endTime`)}
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-8 text-sm"
                        disabled={isSubmitting}
                      />
                      <Clock className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleAddTimeSlot(subjectIndex)}
                        className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded flex items-center justify-center transition-colors"
                        disabled={isSubmitting}
                        title="Add time slot"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      {watch(`subjects.${subjectIndex}.timeSlots`).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTimeSlot(subjectIndex, timeSlotIndex)}
                          className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center transition-colors"
                          disabled={isSubmitting}
                          title="Remove time slot"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Add Subject Button */}
        <button
          type="button"
          onClick={handleAddSubject}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 text-gray-600 hover:border-orange-400 hover:text-orange-600 transition-colors flex items-center justify-center gap-2"
          disabled={isSubmitting || subjectFields.length >= 20}
        >
          <Plus className="w-4 h-4" />
          <span>Add Another Subject</span>
        </button>

        {/* Submit Button */}
        <div className="sticky bottom-0 bg-white pt-4">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Timetable...</span>
              </>
            ) : (
              <span>Save Timetable</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}