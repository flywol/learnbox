import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, User } from "lucide-react";
import { forwardRef, useImperativeHandle } from "react";
import { createUserSchema } from "../schemas/userSchema";
import type { CreateUserFormData } from "../schemas/userSchema";
import type { UserRole } from "../types/user.types";
import RoleSpecificFields from "./RoleSpecificFields";

interface CreateUserFormProps {
  onSubmit: (data: CreateUserFormData) => void;
  loading?: boolean;
}

export interface CreateUserFormRef {
  reset: () => void;
}

const CreateUserForm = forwardRef<CreateUserFormRef, CreateUserFormProps>(({ onSubmit, loading = false }, ref) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors }
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      assignedSubjects: [],
      assignedClasses: [],
      assignedClassArms: [],
      linkedChildren: []
    }
  });

  const selectedRole = watch("role");
  const userRoles: UserRole[] = ["Student", "Teacher", "Parent"];

  // Expose reset method to parent component
  useImperativeHandle(ref, () => ({
    reset: () => {
      reset();
    }
  }));

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("profileImage", file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Profile Image Upload */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            <User className="w-10 h-10 text-gray-500" />
          </div>
          <label
            htmlFor="profileImage"
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors"
          >
            <Camera className="w-3 h-3 text-white" />
          </label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        <span className="text-gray-600">Upload image</span>
      </div>

      {/* Base Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            {...register("fullName")}
            placeholder="Enter full name"
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
            Email *
          </label>
          <input
            type="email"
            {...register("email")}
            placeholder="Enter email address"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role *
          </label>
          <select
            {...register("role")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.role ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select role</option>
            {userRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
          )}
        </div>
      </div>

      {/* Role-Specific Fields */}
      {selectedRole && (
        <div className="border-t pt-4">
          <RoleSpecificFields
            control={control}
            register={register}
            setValue={setValue}
            errors={errors}
            watch={watch}
          />
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4 border-t">
        <button
          type="submit"
          disabled={loading || !selectedRole}
          className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Creating User..." : "Create User"}
        </button>
      </div>
    </form>
  );
});

CreateUserForm.displayName = "CreateUserForm";

export default CreateUserForm;