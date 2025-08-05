import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Upload } from "lucide-react";
import { useSchoolInformation, useUpdateSchoolInfo } from "../hooks/useProfile";

const schoolInfoSchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  schoolShortName: z.string().optional(),
  schoolWebsite: z.string().optional(),
  schoolPhoneNumber: z.string().optional(),
  schoolEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  schoolAddress: z.string().optional(),
  learnboxUrl: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  schoolPrincipal: z.string().optional(),
  schoolMotto: z.string().optional(),
  schoolType: z.string().optional(),
  schoolLogo: z.string().optional(),
  principalSignature: z.string().optional(),
});

type SchoolInfoFormData = z.infer<typeof schoolInfoSchema>;

export default function EditSchoolInfoPage() {
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  // Fetch current school information
  const { data: schoolInfo, isLoading } = useSchoolInformation();
  const updateSchoolInfoMutation = useUpdateSchoolInfo();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<SchoolInfoFormData>({
    resolver: zodResolver(schoolInfoSchema),
    values: {
      schoolName: schoolInfo?.schoolName || "",
      schoolShortName: schoolInfo?.schoolShortName || "",
      schoolWebsite: schoolInfo?.schoolWebsite || "",
      schoolPhoneNumber: schoolInfo?.schoolPhoneNumber || "",
      schoolEmail: schoolInfo?.schoolEmail || "",
      schoolAddress: schoolInfo?.schoolAddress || "",
      learnboxUrl: schoolInfo?.learnboxUrl || "",
      country: schoolInfo?.country || "",
      state: schoolInfo?.state || "",
      schoolPrincipal: schoolInfo?.schoolPrincipal || "",
      schoolMotto: schoolInfo?.schoolMotto || "",
      schoolType: schoolInfo?.schoolType || "",
    }
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        // Convert to base64 string (remove data:image/...;base64, prefix)
        const base64 = result.split(',')[1];
        setValue("schoolLogo", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSignaturePreview(result);
        // Convert to base64 string (remove data:image/...;base64, prefix)
        const base64 = result.split(',')[1];
        setValue("principalSignature", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: SchoolInfoFormData) => {
    try {
      await updateSchoolInfoMutation.mutateAsync(data);
      navigate("/profile");
    } catch (error) {
      console.error("Failed to update school information:", error);
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
            <p className="text-gray-500 mt-2">Loading school information...</p>
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
          <span className="text-lg font-medium">Edit School Information</span>
        </button>
      </div>

      {/* Error Message */}
      {updateSchoolInfoMutation.isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">
            {updateSchoolInfoMutation.error?.message || "Failed to update school information. Please try again."}
          </p>
        </div>
      )}

      {/* Edit Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                {...register("schoolName")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.schoolName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="School Name"
              />
              {errors.schoolName && (
                <p className="text-sm text-red-600 mt-1">{errors.schoolName.message}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                {...register("schoolShortName")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Short Name"
              />
            </div>

            <div>
              <input
                type="text"
                {...register("schoolPrincipal")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Principal Name"
              />
            </div>

            <div>
              <input
                type="tel"
                {...register("schoolPhoneNumber")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Phone Number"
              />
            </div>

            <div>
              <input
                type="email"
                {...register("schoolEmail")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.schoolEmail ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="School Email"
              />
              {errors.schoolEmail && (
                <p className="text-sm text-red-600 mt-1">{errors.schoolEmail.message}</p>
              )}
            </div>

            <div>
              <input
                type="url"
                {...register("schoolWebsite")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Website"
              />
            </div>

            <div>
              <input
                type="text"
                {...register("country")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Country"
              />
            </div>

            <div>
              <input
                type="text"
                {...register("state")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="State"
              />
            </div>

            <div>
              <input
                type="text"
                {...register("schoolType")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="School Type"
              />
            </div>

            <div>
              <input
                type="url"
                {...register("learnboxUrl")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="LearnBox URL"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <input
              type="text"
              {...register("schoolAddress")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="School Address"
            />
          </div>

          {/* School Motto */}
          <div>
            <input
              type="text"
              {...register("schoolMotto")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="School Motto"
            />
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* School Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School Logo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {logoPreview ? (
                  <img src={logoPreview} alt="School Logo" className="mx-auto h-20 w-20 object-contain" />
                ) : (
                  <div className="text-gray-400">
                    <Upload className="mx-auto h-8 w-8 mb-2" />
                    <p className="text-sm">Upload school logo</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="schoolLogo"
                />
                <label
                  htmlFor="schoolLogo"
                  className="mt-2 inline-block px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Choose File
                </label>
              </div>
            </div>

            {/* Principal Signature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Principal Signature</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {signaturePreview ? (
                  <img src={signaturePreview} alt="Principal Signature" className="mx-auto h-20 w-40 object-contain" />
                ) : (
                  <div className="text-gray-400">
                    <Upload className="mx-auto h-8 w-8 mb-2" />
                    <p className="text-sm">Upload signature</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureUpload}
                  className="hidden"
                  id="principalSignature"
                />
                <label
                  htmlFor="principalSignature"
                  className="mt-2 inline-block px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Choose File
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={updateSchoolInfoMutation.isPending}
              className="w-full max-w-md px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {updateSchoolInfoMutation.isPending ? "Updating..." : "Update School Information"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}