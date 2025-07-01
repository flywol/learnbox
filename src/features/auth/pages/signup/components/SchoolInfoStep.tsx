import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { schoolInfoSchema } from "@/features/auth/schemas";



type SchoolInfoFormData = z.infer<typeof schoolInfoSchema>;

interface SchoolInfoStepProps {
	onNext: (schoolInfo: SchoolInfoFormData, generatedUrl: string) => void;
	initialData?: SchoolInfoFormData;
}

export default function SchoolInfoStep({
	onNext,
	initialData,
}: SchoolInfoStepProps) {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
	} = useForm<SchoolInfoFormData>({
		resolver: zodResolver(schoolInfoSchema),
		mode: "onChange",
		defaultValues: initialData || {
			schoolShortName: "",
			schoolName: "",
			website: "",
		},
	});

	const shortName = watch("schoolShortName");
	const generatedUrl = `https://${
		shortName?.toLowerCase().replace(/\s+/g, "") || "yourschool"
	}.learnbox.com`;

	const onSubmit = (data: SchoolInfoFormData) => {
		onNext(data, generatedUrl);
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(generatedUrl);
	};

	return (
		<div className="min-h-screen bg-white px-4 py-12">
			<div className="max-w-3xl mx-auto">
				<div className="flex flex-col items-center mb-16">
					<img
						src="/logo-splash.svg"
						alt="LearnBox logo"
						className="w-28 h-20"
					/>
					<h2 className="text-3xl font-semibold mt-10">Sign Up</h2>
					<p className="text-gray-600 mt-2 text-center">
						Let's start with a bit of information about your school
					</p>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<input
								type="text"
								placeholder="School name *"
								{...register("schoolName")}
								className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-orange-500 ${
									errors.schoolName ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.schoolName && (
								<p className="text-red-500 text-xs mt-1">
									{errors.schoolName.message}
								</p>
							)}
						</div>

						<div>
							<input
								type="text"
								placeholder="School short name *"
								{...register("schoolShortName")}
								className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-orange-500 ${
									errors.schoolShortName ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.schoolShortName && (
								<p className="text-red-500 text-xs mt-1">
									{errors.schoolShortName.message}
								</p>
							)}
						</div>

						<div className="relative col-span-1">
							<label className="absolute -top-2 left-3 bg-white text-xs text-orange-500 px-1">
								This will be the main URL to your portal
							</label>
							<input
								type="text"
								value={generatedUrl}
								readOnly
								className="w-full px-4 py-3 pr-10 border border-orange-500 bg-orange-50 rounded-lg text-sm text-orange-600 focus:outline-none"
							/>
							<button
								type="button"
								onClick={copyToClipboard}
								className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-orange-600">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
									/>
								</svg>
							</button>
						</div>

						<div>
							<input
								type="text"
								placeholder="School website (optional)"
								{...register("website")}
								className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-orange-500 ${
									errors.website ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.website && (
								<p className="text-red-500 text-xs mt-1">
									{errors.website.message}
								</p>
							)}
						</div>
					</div>

					<div className="flex justify-center pt-12">
						<button
							type="submit"
							disabled={!isValid}
							className={`w-48 py-3 rounded-full font-semibold text-base transition-colors ${
								isValid
									? "bg-orange-500 text-white hover:bg-orange-600"
									: "bg-gray-200 text-gray-400 cursor-not-allowed"
							}`}>
							Next
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
