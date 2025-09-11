import { z } from 'zod';

// Schema for creating an event
export const createEventSchema = z.object({
  description: z
    .string()
    .min(1, 'Description is required')
    .max(100, 'Description must be less than 100 characters'),
  
  receivers: z.enum(['all', 'parents', 'students', 'teachers'], {
    required_error: 'Please select receivers',
  }),
  
  date: z
    .string()
    .min(1, 'Date is required')
    .refine((date) => {
      // Check if date is in the future (or today)
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Date must be today or in the future'),
  
  repeat: z.enum(['no', 'daily', 'weekly', 'monthly', 'yearly'], {
    required_error: 'Please select repeat option',
  }),
  
  // Optional time fields
  startTime: z.string().optional(),
  endTime: z.string().optional(),
}).refine((data) => {
  // If both times are provided, ensure start time is before end time
  if (data.startTime && data.endTime) {
    const start = new Date(`2000-01-01T${data.startTime}`);
    const end = new Date(`2000-01-01T${data.endTime}`);
    return start < end;
  }
  return true;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;