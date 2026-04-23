import { UseFormReturn } from "react-hook-form";
import { SchoolSetupFormData } from "../../../schemas/authSchema";

interface SchoolDomainStepProps {
	form: UseFormReturn<SchoolSetupFormData>;
	onSubmit: (data: SchoolSetupFormData) => Promise<void>;
	isVisible: boolean;
	isValidating: boolean;
}

export default function SchoolDomainStep({ form, onSubmit, isVisible, isValidating }: SchoolDomainStepProps) {
	return (
		<div
			className={`w-full max-w-[480px] absolute transition-transform duration-500 ease-in-out ${
				isVisible ? "translate-x-0" : "-translate-x-full opacity-0 pointer-events-none"
			}`}
		>
			<div className="border border-[#e6e6e6] rounded-2xl p-10 flex flex-col gap-6 items-center">
				{/* Header */}
				<div className="flex flex-col items-center gap-1 text-center text-[#2b2b2b]">
					<h1 className="text-4xl font-bold leading-snug">Sign In</h1>
					<p className="text-base font-normal text-[#838383]">Sign in to stay connected.</p>
				</div>

				{/* Form */}
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
					<div>
						<input
							id="schoolUrl"
							type="text"
							{...form.register("schoolUrl")}
							className="w-full h-12 px-4 border border-[#969696] rounded-lg text-sm placeholder:text-[#838383] focus:outline-none focus:border-[#fd5d26] transition-colors"
							placeholder="Input school domain"
							disabled={isValidating}
						/>
						{form.formState.errors.schoolUrl && (
							<p className="text-red-500 text-sm mt-1">
								{form.formState.errors.schoolUrl.message}
							</p>
						)}
						<div className="flex justify-end mt-1">
							<a href="#" className="text-sm text-[#2b2b2b] hover:text-[#fd5d26]">
								Need help
							</a>
						</div>
					</div>

					<button
						type="submit"
						disabled={isValidating}
						className="w-full bg-[#fd5d26] text-white py-3.5 rounded-2xl text-base font-semibold hover:bg-[#e84d17] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
					>
						{isValidating ? "Validating..." : "Next"}
					</button>
				</form>
			</div>
		</div>
	);
}
