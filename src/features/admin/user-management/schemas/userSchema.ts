import { z } from "zod";

const baseUserSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["Student", "Teacher", "Parent"]),
  profileImage: z.instanceof(File).optional(),
});

const studentUserSchema = baseUserSchema.extend({
  role: z.literal("Student"),
  classLevel: z.string().min(1, "Class level is required"),
  classArm: z.string().min(1, "Class arm is required"),
  admissionNumber: z.string().min(1, "Admission number is required"),
  parentGuardianName: z.string().min(1, "Parent/guardian name is required"),
  gender: z.enum(["Male", "Female"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

const teacherUserSchema = baseUserSchema.extend({
  role: z.literal("Teacher"),
  gender: z.enum(["Male", "Female"]),
  phoneNumber: z.string().min(1, "Phone number is required"),
  employmentStatus: z.enum(["Full time", "Part time", "Contract"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  assignedClasses: z.array(z.string()).min(1, "At least one class must be assigned"),
  assignedClassArms: z.array(z.string()).min(1, "At least one class arm must be assigned"),
  assignedSubjects: z.array(z.string()).min(1, "At least one subject must be assigned"),
});

const parentUserSchema = baseUserSchema.extend({
  role: z.literal("Parent"),
  linkedChildren: z.array(z.string()).min(1, "At least one child must be linked"),
  relationshipToStudent: z.string().min(1, "Relationship to student is required"),
  gender: z.enum(["Male", "Female"]),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

export const createUserSchema = z.discriminatedUnion("role", [
  studentUserSchema,
  teacherUserSchema,
  parentUserSchema,
]);

export type CreateUserFormData = z.infer<typeof createUserSchema>;