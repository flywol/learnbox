import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useSchoolSetupStore } from "../../store/schoolSetupStore";
import FileUploadZone from "../FileUploadZone";
import schoolSetupApiClient from "@/features/dashboard/api/schoolSetupApiClient";
import { profileApiClient } from "@/features/profile/api/profileApiClient";
import { completeSchoolInfoSchema } from "@/features/dashboard/schema/dashboardSchema";

type SchoolInfoFormData = z.infer<typeof completeSchoolInfoSchema>;

// Nigerian states list
const NIGERIAN_STATES = [
	"Abia",
	"Adamawa",
	"Akwa Ibom",
	"Anambra",
	"Bauchi",
	"Bayelsa",
	"Benue",
	"Borno",
	"Cross River",
	"Delta",
	"Ebonyi",
	"Edo",
	"Ekiti",
	"Enugu",
	"Gombe",
	"Imo",
	"Jigawa",
	"Kaduna",
	"Kano",
	"Katsina",
	"Kebbi",
	"Kogi",
	"Kwara",
	"Lagos",
	"Nasarawa",
	"Niger",
	"Ogun",
	"Ondo",
	"Osun",
	"Oyo",
	"Plateau",
	"Rivers",
	"Sokoto",
	"Taraba",
	"Yobe",
	"Zamfara",
	"FCT",
];

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

	// Set prefilled values from backend, auth store, and signup data
	useEffect(() => {
		const loadBackendData = async () => {
			try {
				// First, try to fetch existing data from backend
				const adminProfile = await profileApiClient.getAdminProfile();
				
				// Pre-populate form with backend data (highest priority)
				if (adminProfile.school?.schoolName) {
					setValue("schoolName", adminProfile.school.schoolName);
					updateSchoolInfo({ schoolName: adminProfile.school.schoolName });
				}
				
				if (adminProfile.school?.schoolShortName) {
					setValue("schoolShortName", adminProfile.school.schoolShortName);
					updateSchoolInfo({ schoolShortName: adminProfile.school.schoolShortName });
				}
				
				if (adminProfile.school?.schoolAddress) {
					setValue("schoolAddress", adminProfile.school.schoolAddress);
					updateSchoolInfo({ schoolAddress: adminProfile.school.schoolAddress });
				}
				
				if (adminProfile.school?.schoolWebsite) {
					setValue("schoolWebsite", adminProfile.school.schoolWebsite);
					updateSchoolInfo({ schoolWebsite: adminProfile.school.schoolWebsite });
				}
				
				if (adminProfile.school?.schoolPhoneNumber) {
					setValue("schoolPhoneNumber", adminProfile.school.schoolPhoneNumber);
					updateSchoolInfo({ schoolPhoneNumber: adminProfile.school.schoolPhoneNumber });
				}
				
				if (adminProfile.school?.schoolEmail) {
					setValue("schoolEmail", adminProfile.school.schoolEmail);
					updateSchoolInfo({ schoolEmail: adminProfile.school.schoolEmail });
				}
				
				if (adminProfile.school?.country) {
					setValue("country", adminProfile.school.country);
					updateSchoolInfo({ country: adminProfile.school.country });
				}
				
				if (adminProfile.school?.state) {
					setValue("state", adminProfile.school.state);
					updateSchoolInfo({ state: adminProfile.school.state });
				}
				
				if (adminProfile.school?.schoolType) {
					setValue("schoolType", adminProfile.school.schoolType);
					updateSchoolInfo({ schoolType: adminProfile.school.schoolType });
				}
				
				if (adminProfile.school?.schoolMotto) {
					setValue("schoolMotto", adminProfile.school.schoolMotto);
					updateSchoolInfo({ schoolMotto: adminProfile.school.schoolMotto });
				}
				
				if (adminProfile.school?.schoolPrincipal) {
					setValue("schoolPrincipal", adminProfile.school.schoolPrincipal);
					updateSchoolInfo({ schoolPrincipal: adminProfile.school.schoolPrincipal });
				}
				
				if (adminProfile.school?.learnboxUrl) {
					setValue("schoolDomain", adminProfile.school.learnboxUrl);
					updateSchoolInfo({ learnboxUrl: adminProfile.school.learnboxUrl });
				}
				
			} catch (error) {
				// If backend call fails, fall back to existing logic
			}
			
			// Set school domain from auth store or signup data if not already set from backend
			if (!schoolInfo.learnboxUrl) {
				const domainToUse = authSchoolDomain || signupData?.learnboxUrl;
				if (domainToUse) {
					setValue("schoolDomain", domainToUse);
					updateSchoolInfo({ learnboxUrl: domainToUse });
				}
			}

			// Pre-fill from signup data if fields are still empty (lowest priority)
			if (signupData) {
				if (signupData.schoolName && !schoolInfo.schoolName) {
					setValue("schoolName", signupData.schoolName);
				}
				if (signupData.schoolShortName && !schoolInfo.schoolShortName) {
					setValue("schoolShortName", signupData.schoolShortName);
				}
				if (signupData.schoolWebsite && !schoolInfo.schoolWebsite) {
					setValue("schoolWebsite", signupData.schoolWebsite);
				}
			}

			// Set principal name if not already set
			if (!schoolInfo.schoolPrincipal) {
				const principalName = signupData?.fullName || user?.fullName;
				if (principalName) {
					setValue("schoolPrincipal", principalName);
				}
			}

			// Set contact info if not already set
			if (!schoolInfo.schoolPhoneNumber) {
				const phoneNumber = signupData?.phoneNumber || user?.phoneNumber;
				if (phoneNumber) {
					setValue("schoolPhoneNumber", phoneNumber);
				}
			}

			// Set email if not already set
			if (!schoolInfo.schoolEmail) {
				const email = signupData?.email || user?.email;
				if (email) {
					setValue("schoolEmail", email);
				}
			}
		};

		loadBackendData();
	}, [setValue, schoolInfo, authSchoolDomain, user, signupData, updateSchoolInfo]);

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

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* School name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							School name *
						</label>
						<input
							type="text"
							{...register("schoolName")}
							placeholder="Enter school name"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							disabled={isSubmitting}
						/>
						{errors.schoolName && (
							<p className="mt-1 text-sm text-red-600">{errors.schoolName.message}</p>
						)}
					</div>

					{/* School short name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							School short name *
						</label>
						<input
							type="text"
							{...register("schoolShortName")}
							placeholder="Enter school short name"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							disabled={isSubmitting}
						/>
						{errors.schoolShortName && (
							<p className="mt-1 text-sm text-red-600">
								{errors.schoolShortName.message}
							</p>
						)}
					</div>

					{/* School schoolPrincipal */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							School schoolPrincipal *
						</label>
						<input
							type="text"
							{...register("schoolPrincipal")}
							placeholder="Enter principal's name"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							disabled={isSubmitting}
						/>
						{errors.schoolPrincipal && (
							<p className="mt-1 text-sm text-red-600">
								{errors.schoolPrincipal.message}
							</p>
						)}
					</div>

					{/* School type */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							School type *
						</label>
						<select
							{...register("schoolType")}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							disabled={isSubmitting}>
							<option value="">Select type</option>
							<option value="primary">Primary School</option>
							<option value="secondary">Secondary School</option>
							<option value="combined">Primary & Secondary</option>
							<option value="nursery">Nursery/Pre-School</option>
							<option value="all">All Levels</option>
						</select>
						{errors.schoolType && (
							<p className="mt-1 text-sm text-red-600">
								{errors.schoolType.message}
							</p>
						)}
					</div>

					{/* School schoolMotto */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							School Motto
						</label>
						<input
							type="text"
							{...register("schoolMotto")}
							placeholder="Enter school schoolMotto (optional)"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							disabled={isSubmitting}
						/>
					</div>

					{/* School address */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							School address *
						</label>
						<input
							type="text"
							{...register("schoolAddress")}
							placeholder="Enter school address"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							disabled={isSubmitting}
						/>
						{errors.schoolAddress && (
							<p className="mt-1 text-sm text-red-600">
								{errors.schoolAddress.message}
							</p>
						)}
					</div>

					{/* Country */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Country *
						</label>
						<select
							{...register("country")}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							disabled={true}>
							<option value="Nigeria">Nigeria</option>
						</select>
						{errors.country && (
							<p className="mt-1 text-sm text-red-600">
								{errors.country.message}
							</p>
						)}
					</div>

					{/* State/Province */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							State/Province *
						</label>
						<select
							{...register("state")}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							disabled={isSubmitting}>
							<option value="">Select state</option>
							{NIGERIAN_STATES.map((state) => (
								<option
									key={state}
									value={state}>
									{state}
								</option>
							))}
						</select>
						{errors.state && (
							<p className="mt-1 text-sm text-red-600">
								{errors.state.message}
							</p>
						)}
					</div>

					{/* School URL */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							School URL
						</label>
						<input
							type="text"
							{...register("schoolDomain")}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-orange-600"
							readOnly
						/>
					</div>

					{/* School website */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							School website
						</label>
						<input
							type="text"
							{...register("schoolWebsite")}
							placeholder="www.yourschool.edu.ng (optional)"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							disabled={isSubmitting}
						/>
						{errors.schoolWebsite && (
							<p className="mt-1 text-sm text-red-600">
								{errors.schoolWebsite.message}
							</p>
						)}
					</div>

					{/* School phone number */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							School phone number *
						</label>
						<div className="flex">
							<div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">
								<span className="text-2xl mr-2">🇳🇬</span>
								<span className="text-gray-700">+234</span>
							</div>
							<input
								type="tel"
								{...register("schoolPhoneNumber")}
								placeholder="801 3567 245"
								className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
								disabled={isSubmitting}
							/>
						</div>
						{errors.schoolPhoneNumber && (
							<p className="mt-1 text-sm text-red-600">
								{errors.schoolPhoneNumber.message}
							</p>
						)}
					</div>

					{/* School email */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							School email *
						</label>
						<input
							type="email"
							{...register("schoolEmail")}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							readOnly
						/>
						{errors.schoolEmail && (
							<p className="mt-1 text-sm text-red-600">
								{errors.schoolEmail.message}
							</p>
						)}
					</div>
				</div>

				{/* File uploads */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							School logo
						</label>
						<FileUploadZone
							onFileSelect={handleLogoUpload}
							accept="image/*"
							maxSize={5 * 1024 * 1024} // 5MB
							currentFile={schoolInfo.schoolLogo}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Principal's signature
						</label>
						<FileUploadZone
							onFileSelect={handleSignatureUpload}
							accept="image/*"
							maxSize={5 * 1024 * 1024} // 5MB
							currentFile={schoolInfo.principalSignature}
						/>
					</div>
				</div>

				{/* Actions */}
				<div className="flex justify-end mt-8">
					<button
						type="submit"
						disabled={!isValid || isSubmitting}
						className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
							isValid && !isSubmitting
								? "bg-orange-500 text-white hover:bg-orange-600"
								: "bg-gray-200 text-gray-400 cursor-not-allowed"
						}`}>
						{isSubmitting && (
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
						)}
						{isSubmitting ? "Saving..." : "Save changes"}
					</button>
				</div>
			</div>
		</form>
	);
}
