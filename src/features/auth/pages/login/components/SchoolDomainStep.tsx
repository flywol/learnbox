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
			<div className="border border-[#e6e6e6] rounded-2xl p-10 flex flex-col gap-16 items-center">
				{/* Header */}
				<div className="flex flex-col items-center gap-2 text-center text-[#2b2b2b]">
					<h1 className="text-5xl font-bold leading-[1.4]">Sign In</h1>
					<p className="text-xl font-normal">Sign in to stay connected.</p>
				</div>

				{/* Form */}
				<div className="w-full flex flex-col gap-20 items-center">
					<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-1">
						<div className="relative">
							<input
								id="schoolUrl"
								type="text"
								{...form.register("schoolUrl")}
								className="w-full h-14 px-4 border border-[#969696] rounded-lg text-base placeholder:text-[#838383] focus:outline-none focus:border-[#fd5d26] transition-colors"
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

						<div className="pt-16">
							<button
								type="submit"
								disabled={isValidating}
								className="w-full bg-[#fd5d26] text-white py-[17px] rounded-2xl text-xl font-semibold hover:bg-[#e84d17] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isValidating ? "Validating..." : "Next"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
