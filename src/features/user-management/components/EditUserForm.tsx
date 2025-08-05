import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import UserAvatar from "./UserAvatar";
import type { DetailedUser } from "../types/user.types";

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
  const genders = ["Male", "Female"];
  const employmentStatuses = ["Full time", "Part time", "Contract"];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("profileImage", file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Profile Image Upload */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <UserAvatar
            src={profileImagePreview}
            name={user.fullName}
            size="xl"
          />
          <label
            htmlFor="profileImage"
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors"
          >
            <Camera className="w-4 h-4 text-white" />
          </label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        <span className="text-gray-600">Tap to change</span>
      </div>

      {/* Base Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            {...register("fullName")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.fullName ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.fullName && (
            <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Role - Read only for edit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            {...register("role")}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
          >
            <option value={user.role}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</option>
          </select>
        </div>
      </div>

      {/* Role-Specific Fields */}
      {selectedRole === "student" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class level</label>
            <input
              type="text"
              {...register("classLevel")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                (errors as any).classLevel ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {(errors as any).classLevel && (
              <p className="text-sm text-red-600 mt-1">{(errors as any).classLevel.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class arm</label>
            <input
              type="text"
              {...register("classArm")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                (errors as any).classArm ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {(errors as any).classArm && (
              <p className="text-sm text-red-600 mt-1">{(errors as any).classArm.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admission number</label>
            <input
              type="text"
              {...register("admissionNumber")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                (errors as any).admissionNumber ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {(errors as any).admissionNumber && (
              <p className="text-sm text-red-600 mt-1">{(errors as any).admissionNumber.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent/guardian name</label>
            <input
              type="text"
              {...register("parentName")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                (errors as any).parentName ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {(errors as any).parentName && (
              <p className="text-sm text-red-600 mt-1">{(errors as any).parentName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              {...register("gender")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.gender ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {genders.map((gender) => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
            {errors.gender && (
              <p className="text-sm text-red-600 mt-1">{errors.gender.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
            <input
              type="date"
              {...register("dateOfBirth")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                (errors as any).dateOfBirth ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {(errors as any).dateOfBirth && (
              <p className="text-sm text-red-600 mt-1">{(errors as any).dateOfBirth.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Teacher Fields */}
      {selectedRole === "teacher" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              {...register("gender")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.gender ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {genders.map((gender) => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
            {errors.gender && (
              <p className="text-sm text-red-600 mt-1">{errors.gender.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
            <input
              type="tel"
              {...register("phoneNumber")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                (errors as any).phoneNumber ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {(errors as any).phoneNumber && (
              <p className="text-sm text-red-600 mt-1">{(errors as any).phoneNumber.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment status</label>
            <select
              {...register("employmentStatus")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                (errors as any).employmentStatus ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {employmentStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            {(errors as any).employmentStatus && (
              <p className="text-sm text-red-600 mt-1">{(errors as any).employmentStatus.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
            <input
              type="date"
              {...register("dateOfBirth")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                (errors as any).dateOfBirth ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {(errors as any).dateOfBirth && (
              <p className="text-sm text-red-600 mt-1">{(errors as any).dateOfBirth.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Parent Fields */}
      {selectedRole === "parent" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship to student</label>
            <input
              type="text"
              {...register("relationshipToStudent")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                (errors as any).relationshipToStudent ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {(errors as any).relationshipToStudent && (
              <p className="text-sm text-red-600 mt-1">{(errors as any).relationshipToStudent.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              {...register("gender")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.gender ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {genders.map((gender) => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
            {errors.gender && (
              <p className="text-sm text-red-600 mt-1">{errors.gender.message}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
            <input
              type="tel"
              {...register("phoneNumber")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                (errors as any).phoneNumber ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {(errors as any).phoneNumber && (
              <p className="text-sm text-red-600 mt-1">{(errors as any).phoneNumber.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Saving changes..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}