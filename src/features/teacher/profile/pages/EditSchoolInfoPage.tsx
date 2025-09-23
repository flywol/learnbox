import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSchoolInformation, useUpdateSchoolInfo } from "../hooks/useProfile";
import PageHeader from "../components/school-info/PageHeader";
import SchoolBasicFields from "../components/school-info/SchoolBasicFields";
import SchoolLocationFields from "../components/school-info/SchoolLocationFields";
import SchoolFileUploads from "../components/school-info/SchoolFileUploads";
import SchoolFormSubmit from "../components/school-info/SchoolFormSubmit";

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
  const [logoError, setLogoError] = useState<string | null>(null);
  const [signatureError, setSignatureError] = useState<string | null>(null);

  // File size limits (in bytes)
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB for logos/signatures
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

  const { data: schoolInfo, isLoading } = useSchoolInformation();
  const updateSchoolInfoMutation = useUpdateSchoolInfo();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SchoolInfoFormData>({
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
    setLogoError(null); // Clear previous errors
    
    if (file) {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setLogoError("Please upload a valid image file (JPEG or PNG only)");
        event.target.value = ''; // Clear the input
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        setLogoError(`File size (${sizeMB}MB) exceeds the maximum limit of 3MB. Please choose a smaller image.`);
        event.target.value = ''; // Clear the input
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        const base64Data = base64String.split(',')[1];
        setLogoPreview(base64String);
        setValue("schoolLogo", base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSignatureError(null); // Clear previous errors
    
    if (file) {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setSignatureError("Please upload a valid image file (JPEG or PNG only)");
        event.target.value = ''; // Clear the input
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        setSignatureError(`File size (${sizeMB}MB) exceeds the maximum limit of 3MB. Please choose a smaller image.`);
        event.target.value = ''; // Clear the input
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        const base64Data = base64String.split(',')[1];
        setSignaturePreview(base64String);
        setValue("principalSignature", base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: SchoolInfoFormData) => {
    updateSchoolInfoMutation.mutate(data, {
      onSuccess: () => {
        navigate("/profile");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading school information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader 
        title="Edit School Information" 
        onBack={() => navigate("/profile")} 
      />
      
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <SchoolBasicFields register={register} errors={errors} />
          <SchoolLocationFields register={register} setValue={setValue} watch={watch} />
          <SchoolFileUploads
            logoPreview={logoPreview}
            signaturePreview={signaturePreview}
            onLogoUpload={handleLogoUpload}
            onSignatureUpload={handleSignatureUpload}
            logoError={logoError}
            signatureError={signatureError}
          />
          <SchoolFormSubmit isSubmitting={updateSchoolInfoMutation.isPending} />
        </form>
      </div>
    </div>
  );
}