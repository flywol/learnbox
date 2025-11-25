import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	forgotPasswordSchema,
	ForgotPasswordFormData,
} from "../../schemas/authSchema";

interface ForgotPasswordFormProps {
	onSubmit: (data: ForgotPasswordFormData) => Promise<void>;
	isLoading: boolean;
	defaultEmail?: string;
	serverError?: string | null;
}

export const ForgotPasswordForm = ({
	onSubmit,
	isLoading,
	defaultEmail = "",
	serverError,
}: ForgotPasswordFormProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: defaultEmail,
		},
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-2">
				<label
					htmlFor="email"
					className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
					Email address
				</label>
				<input
					id="email"
					type="email"
					{...register("email")}
					className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all"
					placeholder="name@example.com"
					disabled={isLoading}
					autoComplete="email"
				/>
				{errors.email && (
					<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
				)}
				{serverError && (
					<p className="text-red-500 text-sm mt-1">{serverError}</p>
				)}
			</div>

			<button
				type="submit"
				disabled={!isValid || isLoading}
				className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
				{isLoading ? (
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
						<span>Sending...</span>
					</div>
				) : (
					"Send Verification Code"
				)}
			</button>
		</form>
	);
};

export default ForgotPasswordForm;
