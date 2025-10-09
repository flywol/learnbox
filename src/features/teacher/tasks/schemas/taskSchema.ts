import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  scheduleStartDate: z.string().min(1, "Schedule start date is required"),
  scheduleTime: z.string().min(1, "Schedule time is required"),
  taskType: z.enum(["Assignment", "Quiz", "Class", "Custom"], {
    required_error: "Task type is required",
  }),
  customTaskType: z.string().optional(),
  repeat: z.enum(["none", "daily", "weekly", "monthly", "yearly"], {
    required_error: "Repeat option is required",
  }),
}).refine((data) => {
  if (data.taskType === "Custom" && (!data.customTaskType || data.customTaskType.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Custom task type is required when 'Custom' is selected",
  path: ["customTaskType"],
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;