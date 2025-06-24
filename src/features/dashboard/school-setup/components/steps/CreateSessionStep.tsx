// src/features/school-setup/components/steps/CreateSessionStep.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSchoolSetupStore } from "../../store/schoolSetupStore";
import { Calendar } from "lucide-react";

const sessionSchema = z
	.object({
		name: z.string().min(1, "Session name is required"),
		terms: z.object({
			first: z.object({
				name: z.string(),
				startDate: z.string().min(1, "Start date is required"),
				endDate: z.string().min(1, "End date is required"),
			}),
			second: z.object({
				name: z.string(),
				startDate: z.string().min(1, "Start date is required"),
				endDate: z.string().min(1, "End date is required"),
			}),
			third: z.object({
				name: z.string(),
				startDate: z.string().min(1, "Start date is required"),
				endDate: z.string().min(1, "End date is required"),
			}),
		}),
	})
	.refine(
		(data) => {
			// Validate that terms don't overlap
			const terms = [
				{
					start: new Date(data.terms.first.startDate),
					end: new Date(data.terms.first.endDate),
				},
				{
					start: new Date(data.terms.second.startDate),
					end: new Date(data.terms.second.endDate),
				},
				{
					start: new Date(data.terms.third.startDate),
					end: new Date(data.terms.third.endDate),
				},
			];

			// Check each term's dates are valid
			for (const term of terms) {
				if (term.start >= term.end) {
					return false;
				}
			}

			// Check for overlaps
			for (let i = 0; i < terms.length; i++) {
				for (let j = i + 1; j < terms.length; j++) {
					const term1 = terms[i];
					const term2 = terms[j];

					if (
						(term1.start <= term2.start && term2.start <= term1.end) ||
						(term1.start <= term2.end && term2.end <= term1.end) ||
						(term2.start <= term1.start && term1.start <= term2.end) ||
						(term2.start <= term1.end && term1.end <= term2.end)
					) {
						return false;
					}
				}
			}

			return true;
		},
		{
			message:
				"Term dates cannot overlap and end date must be after start date",
		}
	);

type SessionFormData = z.infer<typeof sessionSchema>;

export default function CreateSessionStep() {
	const { session, updateSession, nextStep, previousStep } =
		useSchoolSetupStore();

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		setError,
	} = useForm<SessionFormData>({
		resolver: zodResolver(sessionSchema),
		mode: "onChange",
		defaultValues: {
			name: session.name || "",
			terms: session.terms || {
				first: { name: "First term", startDate: "", endDate: "" },
				second: { name: "Second term", startDate: "", endDate: "" },
				third: { name: "Third term", startDate: "", endDate: "" },
			},
		},
	});

	const onSubmit = (data: SessionFormData) => {
		updateSession(data);
		nextStep();
	};

	const formatDate = (dateString: string) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return date
			.toLocaleDateString("en-GB", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			})
			.replace(/\//g, "/");
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-8">
			<div className="bg-white rounded-lg shadow p-6">
				<h2 className="text-xl font-semibold mb-6">Create Session</h2>

				{/* Session Name */}
				<div className="mb-8">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Session
					</label>
					<select
						{...register("name")}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
						<option value="">Select session</option>
						<option value="2024/2025">2024/2025 Academic Session</option>
						<option value="2025/2026">2025/2026 Academic Session</option>
						<option value="custom">Custom Session Name</option>
					</select>
					{errors.name && (
						<p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
					)}
				</div>

				{/* Terms */}
				<div className="space-y-6">
					{/* First Term */}
					<div className="border rounded-lg p-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Term
								</label>
								<input
									type="text"
									{...register("terms.first.name")}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
									readOnly
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Term start date *
								</label>
								<div className="relative">
									<input
										type="date"
										{...register("terms.first.startDate")}
										className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									/>
									<Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Term end date *
								</label>
								<div className="relative">
									<input
										type="date"
										{...register("terms.first.endDate")}
										className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									/>
									<Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
								</div>
							</div>
						</div>
						{errors.terms?.first && (
							<p className="mt-2 text-sm text-red-600">
								Please fill all dates for first term
							</p>
						)}
					</div>

					{/* Second Term */}
					<div className="border rounded-lg p-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Term
								</label>
								<input
									type="text"
									{...register("terms.second.name")}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
									readOnly
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Term start date *
								</label>
								<div className="relative">
									<input
										type="date"
										{...register("terms.second.startDate")}
										className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									/>
									<Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Term end date *
								</label>
								<div className="relative">
									<input
										type="date"
										{...register("terms.second.endDate")}
										className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									/>
									<Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
								</div>
							</div>
						</div>
						{errors.terms?.second && (
							<p className="mt-2 text-sm text-red-600">
								Please fill all dates for second term
							</p>
						)}
					</div>

					{/* Third Term */}
					<div className="border rounded-lg p-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Term
								</label>
								<input
									type="text"
									{...register("terms.third.name")}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
									readOnly
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Term start date *
								</label>
								<div className="relative">
									<input
										type="date"
										{...register("terms.third.startDate")}
										className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									/>
									<Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Term end date *
								</label>
								<div className="relative">
									<input
										type="date"
										{...register("terms.third.endDate")}
										className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									/>
									<Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
								</div>
							</div>
						</div>
						{errors.terms?.third && (
							<p className="mt-2 text-sm text-red-600">
								Please fill all dates for third term
							</p>
						)}
					</div>
				</div>

				{errors.terms && (
					<p className="mt-4 text-sm text-red-600">{errors.terms.message}</p>
				)}

				{/* Actions */}
				<div className="flex justify-between mt-8">
					<button
						type="button"
						onClick={previousStep}
						className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
						Back
					</button>
					<button
						type="submit"
						disabled={!isValid}
						className={`px-8 py-3 rounded-lg font-medium transition-colors ${
							isValid
								? "bg-orange-500 text-white hover:bg-orange-600"
								: "bg-gray-200 text-gray-400 cursor-not-allowed"
						}`}>
						Create session
					</button>
				</div>
			</div>
		</form>
	);
}
