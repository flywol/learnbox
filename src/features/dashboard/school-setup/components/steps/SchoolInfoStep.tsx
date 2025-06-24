// src/features/school-setup/components/steps/SchoolInfoStep.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useSchoolSetupStore } from "../../store/schoolSetupStore";
import FileUploadZone from "../FileUploadZone";

const schoolInfoSchema = z.object({
	name: z.string().min(1, "School name is required"),
	shortName: z.string().min(1, "School short name is required"),
	principal: z.string().min(1, "Principal name is required"),
	schoolType: z.string().min(1, "Please select school type"),
	motto: z.string().optional(),
	address: z.string().min(1, "School address is required"),
	country: z.string().min(1, "Country is required"),
	state: z.string().min(1, "State/Province is required"),
	schoolUrl: z.string(),
	website: z.string().url().optional().or(z.literal("")),
	phoneNumber: z.string().min(1, "Phone number is required"),
	email: z.string().email("Invalid email address"),
});

type SchoolInfoFormData = z.infer<typeof schoolInfoSchema>;

export default function SchoolInfoStep() {
	const { user } = useAuthStore();
	const { schoolInfo, updateSchoolInfo, nextStep } = useSchoolSetupStore();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isValid },
	} = useForm<SchoolInfoFormData>({
		resolver: zodResolver(schoolInfoSchema),
		mode: "onChange",
		defaultValues: {
			name: schoolInfo.name || "",
			shortName: schoolInfo.shortName || "",
			principal: schoolInfo.principal || "",
			schoolType: schoolInfo.schoolType || "",
			motto: schoolInfo.motto || "",
			address: schoolInfo.address || "",
			country: schoolInfo.country || "Nigeria",
			state: schoolInfo.state || "",
			schoolUrl: schoolInfo.schoolUrl || "",
			website: schoolInfo.website || "",
			phoneNumber: schoolInfo.phoneNumber || "",
			email: schoolInfo.email || user?.email || "",
		},
	});

	// Set prefilled values from signup
	useEffect(() => {
		// These would come from the auth store or API
		// For now, using placeholder values
		if (!schoolInfo.name) {
			setValue("name", "Lakebridge Mountain High School");
			setValue("shortName", "Lakebridgers");
			setValue("schoolUrl", "https://lakebridge.learnbox.com");
		}
	}, [setValue, schoolInfo]);

	const onSubmit = (data: SchoolInfoFormData) => {
		updateSchoolInfo(data);
		nextStep();
	};

	const handleLogoUpload = (file: File) => {
		updateSchoolInfo({ logo: file });
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

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* School name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							School name *
						</label>
						<input
							type="text"
							{...register("name")}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							readOnly
						/>
						{errors.name && (
							<p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
						)}
					</div>

					{/* School short name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							School short name *
						</label>
						<input
							type="text"
							{...register("shortName")}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							readOnly
						/>
						{errors.shortName && (
							<p className="mt-1 text-sm text-red-600">
								{errors.shortName.message}
							</p>
						)}
					</div>

					{/* School principal */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							School principal *
						</label>
						<input
							type="text"
							{...register("principal")}
							placeholder="Gabriel Davidson"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
						/>
						{errors.principal && (
							<p className="mt-1 text-sm text-red-600">
								{errors.principal.message}
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
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
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

					{/* School motto */}
					<div className="md:col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							School motto
						</label>
						<input
							type="text"
							{...register("motto")}
							placeholder="Enter school motto (optional)"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
						/>
					</div>

					{/* School address */}
					<div className="md:col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							School address *
						</label>
						<input
							type="text"
							{...register("address")}
							placeholder="Enter school address"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
						/>
						{errors.address && (
							<p className="mt-1 text-sm text-red-600">
								{errors.address.message}
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
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
							<option value="Nigeria">Nigeria</option>
							<option value="Ghana">Ghana</option>
							<option value="Kenya">Kenya</option>
							<option value="South Africa">South Africa</option>
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
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
							<option value="">Select state</option>
							<option value="Lagos">Lagos</option>
							<option value="Abuja">Abuja</option>
							<option value="Rivers">Rivers</option>
							<option value="Oyo">Oyo</option>
							{/* Add more states */}
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
							{...register("schoolUrl")}
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
							{...register("website")}
							placeholder="www.yourschool.edu.ng (optional)"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
						/>
						{errors.website && (
							<p className="mt-1 text-sm text-red-600">
								{errors.website.message}
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
								{...register("phoneNumber")}
								placeholder="801 3567 245"
								className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							/>
						</div>
						{errors.phoneNumber && (
							<p className="mt-1 text-sm text-red-600">
								{errors.phoneNumber.message}
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
							{...register("email")}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							readOnly
						/>
						{errors.email && (
							<p className="mt-1 text-sm text-red-600">
								{errors.email.message}
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
							currentFile={schoolInfo.logo}
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
						disabled={!isValid}
						className={`px-8 py-3 rounded-lg font-medium transition-colors ${
							isValid
								? "bg-orange-500 text-white hover:bg-orange-600"
								: "bg-gray-200 text-gray-400 cursor-not-allowed"
						}`}>
						Save changes
					</button>
				</div>
			</div>
		</form>
	);
}
