import { z } from 'zod';

// Time validation helper
const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

const timeSlotSchema = z.object({
  id: z.string(),
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', ''], {
    errorMap: () => ({ message: 'Please select a day' }),
  }).refine(val => val !== '', { message: 'Please select a day' }),
  startTime: z.string()
    .min(1, 'Start time is required')
    .regex(timeRegex, 'Invalid time format (HH:MM)'),
  endTime: z.string()
    .min(1, 'End time is required')
    .regex(timeRegex, 'Invalid time format (HH:MM)'),
}).refine((data) => {
  if (!data.startTime || !data.endTime) return true; // Let other validations handle empty fields
  
  const start = new Date(`1970-01-01T${data.startTime}:00`);
  const end = new Date(`1970-01-01T${data.endTime}:00`);
  
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

const subjectSchema = z.object({
  id: z.string(),
  subjectName: z.string()
    .min(1, 'Subject name is required')
    .max(50, 'Subject name must be less than 50 characters'),
  timeSlots: z.array(timeSlotSchema)
    .min(1, 'At least one time slot is required for each subject'),
});

export const timetableSchema = z.object({
  classId: z.string().min(1, 'Class ID is required'),
  subjects: z.array(subjectSchema)
    .min(1, 'At least one subject is required')
    .max(20, 'Maximum 20 subjects allowed'),
}).refine((data) => {
  // Check for overlapping time slots
  const allTimeSlots: Array<{ day: string; startTime: string; endTime: string; subject: string }> = [];
  
  data.subjects.forEach(subject => {
    subject.timeSlots.forEach(slot => {
      if (slot.day && slot.startTime && slot.endTime) {
        allTimeSlots.push({
          day: slot.day,
          startTime: slot.startTime,
          endTime: slot.endTime,
          subject: subject.subjectName,
        });
      }
    });
  });
  
  // Check for overlaps
  for (let i = 0; i < allTimeSlots.length; i++) {
    for (let j = i + 1; j < allTimeSlots.length; j++) {
      const slot1 = allTimeSlots[i];
      const slot2 = allTimeSlots[j];
      
      // Same day check
      if (slot1.day === slot2.day) {
        const start1 = new Date(`1970-01-01T${slot1.startTime}:00`);
        const end1 = new Date(`1970-01-01T${slot1.endTime}:00`);
        const start2 = new Date(`1970-01-01T${slot2.startTime}:00`);
        const end2 = new Date(`1970-01-01T${slot2.endTime}:00`);
        
        // Check for overlap
        if (start1 < end2 && start2 < end1) {
          return false;
        }
      }
    }
  }
  
  return true;
}, {
  message: 'Time slots cannot overlap on the same day',
  path: ['subjects'],
});

export type TimetableFormData = z.infer<typeof timetableSchema>;