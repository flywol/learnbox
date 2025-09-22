import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Camera } from "lucide-react";
import { useAdminProfile, useUpdatePersonalInfo } from "../hooks/useProfile";
import UserAvatar from "../../../admin/user-management/components/UserAvatar";

const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  position: z.string().optional(),
  profilePicture: z.instanceof(File).optional(),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export default function EditPersonalInfoPage() {
  const navigate = useNavigate();
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // File size limits (in bytes)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

  // Fetch current profile data
  const { data: adminProfile, isLoading } = useAdminProfile();
  const updatePersonalInfoMutation = useUpdatePersonalInfo();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      gender: undefined,
      position: "",
    }
  });

  // Pre-fill form when admin profile data is loaded
  // Use useEffect to avoid infinite loops
  React.useEffect(() => {
    if (adminProfile) {
      reset({
        fullName: adminProfile.fullName || "",
        email: adminProfile.email || "",
        phoneNumber: adminProfile.phoneNumber || "",
        gender: adminProfile.gender || undefined,
        position: adminProfile.position || "",
      });
    }
  }, [adminProfile, reset]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError(null); // Clear previous errors
    
    if (file) {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setUploadError("Please upload a valid image file (JPEG or PNG only)");
        event.target.value = ''; // Clear the input
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        setUploadError(`File size (${sizeMB}MB) exceeds the maximum limit of 5MB. Please choose a smaller image.`);
        event.target.value = ''; // Clear the input
        return;
      }

      setValue("profilePicture", file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: PersonalInfoFormData) => {
    try {
      await updatePersonalInfoMutation.mutateAsync(data);
      navigate("/profile");
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={handleCancel}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-lg font-medium">Edit Personal Information</span>
        </button>
      </div>

      {/* Error Message */}
      {updatePersonalInfoMutation.isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">
            {updatePersonalInfoMutation.error?.message || "Failed to update profile. Please try again."}
          </p>
        </div>
      )}

      {/* Edit Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <UserAvatar
                src={profileImagePreview || adminProfile?.profilePicture}
                name={adminProfile?.fullName || "Admin"}
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
            <div className="flex flex-col">
              <span className="text-gray-600 text-sm">Tap to change</span>
              <span className="text-gray-500 text-xs">Max size: 5MB (JPEG, PNG only)</span>
            </div>
          </div>

          {/* Upload Error Message */}
          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{uploadError}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Top Row: Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  {...register("fullName")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.fullName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Name"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Second Row: Phone Number and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="tel"
                  {...register("phoneNumber")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Phone number"
                />
              </div>

              <div className="relative">
                <select
                  {...register("gender")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Third Row: Position (full width) */}
            <div>
              <input
                type="text"
                {...register("position")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Position"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={updatePersonalInfoMutation.isPending}
              className="w-full max-w-md px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {updatePersonalInfoMutation.isPending ? "Updating Profile..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}