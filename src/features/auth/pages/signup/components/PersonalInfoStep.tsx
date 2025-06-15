import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const personalInfoSchema = z.object({
	fullName: z
		.string()
		.min(1, "Full name is required")
		.min(2, "Full name must be at least 2 characters"),
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email"),
	phoneNumber: z
		.string()
		.min(1, "Phone number is required")
		.regex(/^\d{10}$/, "Phone number must be 10 digits"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(8, "Password must be at least 8 characters")
		.regex(/[0-9]/, "Password must contain at least one number")
		.regex(
			/[^A-Za-z0-9]/,
			"Password must contain at least one special character"
		),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoStepProps {
	onNext: (personalInfo: PersonalInfoFormData) => void;
	initialData?: PersonalInfoFormData;
}

export default function PersonalInfoStep({
	onNext,
	initialData,
}: PersonalInfoStepProps) {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<PersonalInfoFormData>({
		resolver: zodResolver(personalInfoSchema),
		mode: "onChange",
		defaultValues: initialData || {
			fullName: "",
			email: "",
			phoneNumber: "",
			password: "",
		},
	});

	const onSubmit = (data: PersonalInfoFormData) => {
		onNext(data);
	};

	return (
		<div className="min-h-screen bg-gray-50 px-4 pt-20">
			<div className="max-w-3xl mx-auto">
				<div className="flex flex-col items-center mb-16">
					<h1 className="text-4xl font-bold leading-tight">Learn</h1>
					<h1 className="text-4xl font-bold leading-tight">
						B<span className="text-orange-500">o</span>x
					</h1>
				</div>

				<h2 className="text-3xl font-bold text-center mb-2">Sign Up</h2>
				<p className="text-center text-gray-600 mb-12">
					Let's know a bit about you
				</p>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<input
								type="text"
								placeholder="Full name *"
								{...register("fullName")}
								className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
									errors.fullName ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.fullName && (
								<p className="text-red-500 text-sm mt-1">
									{errors.fullName.message}
								</p>
							)}
						</div>

						<div>
							<input
								type="email"
								placeholder="Email address *"
								{...register("email")}
								className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
									errors.email ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.email && (
								<p className="text-red-500 text-sm mt-1">
									{errors.email.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<div
								className={`flex items-center border rounded-lg overflow-hidden focus-within:border-orange-500 ${
									errors.phoneNumber ? "border-red-500" : "border-gray-300"
								}`}>
								<div className="flex items-center px-3 bg-gray-50 border-r">
									<span className="text-2xl mr-2">🇳🇬</span>
									<span className="text-gray-700">+234</span>
									<svg
										className="w-4 h-4 ml-1 text-gray-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</div>
								<input
									type="tel"
									placeholder="Phone number *"
									{...register("phoneNumber")}
									className="flex-1 px-4 py-3 focus:outline-none"
								/>
							</div>
							{errors.phoneNumber && (
								<p className="text-red-500 text-sm mt-1">
									{errors.phoneNumber.message}
								</p>
							)}
						</div>

						<div>
							<input
								type="password"
								placeholder="Password *"
								{...register("password")}
								className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500 ${
									errors.password ? "border-red-500" : "border-gray-300"
								}`}
							/>
							<p
								className={`text-sm mt-1 ${
									errors.password ? "text-red-500" : "text-gray-500"
								}`}>
								{errors.password?.message ||
									"At least 8 characters, including numbers and symbols"}
							</p>
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
