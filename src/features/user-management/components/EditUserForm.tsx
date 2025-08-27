import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import type { DetailedUser } from "../types/user.types";
import ProfileImageUpload from "./edit-user/ProfileImageUpload";
import EditBaseFields from "./edit-user/EditBaseFields";
import EditRoleFields from "./edit-user/EditRoleFields";
import EditFormActions from "./edit-user/EditFormActions";

// Edit schemas - simplified from create schemas
const baseEditUserSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["student", "teacher", "parent"]),
  profileImage: z.instanceof(File).optional(),
});

const studentEditSchema = baseEditUserSchema.extend({
  role: z.literal("student"),
  classLevel: z.string().min(1, "Class level is required"),
  classArm: z.string().min(1, "Class arm is required"),
  admissionNumber: z.string().min(1, "Admission number is required"),
  parentName: z.string().min(1, "Parent/guardian name is required"),
  gender: z.enum(["Male", "Female"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

const teacherEditSchema = baseEditUserSchema.extend({
  role: z.literal("teacher"),
  gender: z.enum(["Male", "Female"]),
  phoneNumber: z.string().min(1, "Phone number is required"),
  employmentStatus: z.enum(["Full time", "Part time", "Contract"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  // Note: assignedClasses, assignedSubjects would need additional handling
});

const parentEditSchema = baseEditUserSchema.extend({
  role: z.literal("parent"),
  relationshipToStudent: z.string().min(1, "Relationship to student is required"),
  gender: z.enum(["Male", "Female"]),
  phoneNumber: z.string().min(1, "Phone number is required"),
  // Note: linkedChildren would need additional handling
});

const editUserSchema = z.discriminatedUnion("role", [
  studentEditSchema,
  teacherEditSchema,
  parentEditSchema,
]);

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserFormProps {
  user: DetailedUser;
  onSubmit: (data: EditUserFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function EditUserForm({ user, onSubmit, onCancel, loading = false }: EditUserFormProps) {
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(user.profilePicture);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      role: user.role as any,
      // Student fields
      classLevel: user.classLevel || "",
      classArm: user.classArm || "",
      admissionNumber: user.admissionNumber || "",
      parentName: user.parentName || "",
      // Teacher/Parent fields
      phoneNumber: user.phoneNumber || "",
      employmentStatus: user.employmentStatus as any || "Full time",
      relationshipToStudent: user.relationshipToStudent || "",
      // Common fields
      gender: user.gender as any || "Male",
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : "",
    }
  });

  const selectedRole = watch("role");

  const handleImageChange = (preview: string | null) => {
    setProfileImagePreview(preview);
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ProfileImageUpload
        currentImage={profileImagePreview}
        userName={user.fullName}
        onImageChange={handleImageChange}
        setValue={setValue}
      />

      <EditBaseFields
        register={register}
        errors={errors}
        currentRole={user.role}
      />

      <EditRoleFields
        selectedRole={selectedRole}
        register={register}
        errors={errors}
      />

      <EditFormActions onCancel={onCancel} loading={loading} />
    </form>
  );
}