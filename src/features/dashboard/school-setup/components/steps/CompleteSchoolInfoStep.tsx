import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useSchoolSetupStore } from "../../store/schoolSetupStore";
import schoolSetupApiClient from "@/features/dashboard/api/schoolSetupApiClient";
import { completeSchoolInfoSchema } from "@/features/dashboard/schema/dashboardSchema";
import SchoolInfoFormFields from "../school-info/SchoolInfoFormFields";
import SchoolFileUploads from "../school-info/SchoolFileUploads";
import SchoolFormActions from "../school-info/SchoolFormActions";
import { useSchoolDataLoader } from "../school-info/useSchoolDataLoader";

type SchoolInfoFormData = z.infer<typeof completeSchoolInfoSchema>;

export default function SchoolInfoStep() {
	const { user, schoolDomain: authSchoolDomain, signupData } = useAuthStore();
	const { schoolInfo, updateSchoolInfo, nextStep } = useSchoolSetupStore();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isValid },
	} = useForm<SchoolInfoFormData>({
		resolver: zodResolver(completeSchoolInfoSchema),
		mode: "onChange",
		defaultValues: {
			schoolName: schoolInfo.schoolName || signupData?.schoolName || "",
			schoolShortName: schoolInfo.schoolShortName || signupData?.schoolShortName || "",
			schoolPrincipal: schoolInfo.schoolPrincipal || signupData?.fullName || user?.fullName || "",
			schoolType: schoolInfo.schoolType,
			schoolMotto: schoolInfo.schoolMotto,
			schoolAddress: schoolInfo.schoolAddress,
			country: "Nigeria",
			state: schoolInfo.state,
			schoolDomain: schoolInfo.learnboxUrl ?? signupData?.learnboxUrl ?? authSchoolDomain ?? undefined,
			schoolWebsite: schoolInfo.schoolWebsite || signupData?.schoolWebsite || "",
			schoolPhoneNumber: schoolInfo.schoolPhoneNumber || signupData?.phoneNumber || user?.phoneNumber || "",
			schoolEmail: schoolInfo.schoolEmail || signupData?.email || user?.email || "",
		},
	});

	// Use the custom hook to handle data loading
	useSchoolDataLoader({
		setValue,
		schoolInfo,
		authSchoolDomain,
		user,
		signupData,
		updateSchoolInfo
	});

	const onSubmit = async (data: SchoolInfoFormData) => {
		setIsSubmitting(true);
		setApiError(null);

		try {
			// Update local store first
			updateSchoolInfo(data);

			// Call API to save school information
			await schoolSetupApiClient.updateSchoolInfo({
				...schoolInfo,
				...data,
			});


			// Move to next step
			nextStep();
		} catch (error: any) {
			setApiError(
				error.message || "Failed to save school information. Please try again."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleLogoUpload = (file: File) => {
		updateSchoolInfo({ schoolLogo: file });
	};

	const handleSignatureUpload = (file: File) => {
		updateSchoolInfo({ principalSignature: file });
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-8">
			<div className="bg-white rounded-lg shadow p-6">
				<h2 className="text-xl font-semibold mb-6">School Information</h2>

				{/* API Error */}
				{apiError && (
					<div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
						{apiError}
					</div>
				)}

				<SchoolInfoFormFields
					register={register}
					errors={errors}
					isSubmitting={isSubmitting}
				/>

				<SchoolFileUploads
					schoolLogo={schoolInfo.schoolLogo}
					principalSignature={schoolInfo.principalSignature}
					onLogoUpload={handleLogoUpload}
					onSignatureUpload={handleSignatureUpload}
				/>

				<SchoolFormActions isValid={isValid} isSubmitting={isSubmitting} />
			</div>
		</form>
	);
}
