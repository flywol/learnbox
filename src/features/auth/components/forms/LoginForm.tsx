import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../store/useAuthStore";
import { User } from "../types/auth.types";

// 1. Define the validation schema with Zod
const loginSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters" }),
});

// Infer the TypeScript type from the schema for type safety
type LoginFormValues = z.infer<typeof loginSchema>;

// 2. Mock API function to simulate a backend call
// TODO: This logic will be moved to an `api` directory and replaced with a real HTTP request.
const loginApi = (
	data: LoginFormValues,
	role: string,
	schoolDomain: string
): Promise<{ user: User }> => {
	console.log(
		`Simulating login for ${data.email} as ${role} at ${schoolDomain}...`
	);
	return new Promise((resolve) => {
		setTimeout(() => {
			// The user now has the pre-selected role instead of null
			const mockUser: User = {
				id: `user-${Date.now()}`,
				name: "Test User",
				email: data.email,
				role: role as any, // The role is already selected
			};
			resolve({ user: mockUser });
		}, 1500); // Simulate 1.5-second network delay
	});
};

export const LoginForm = () => {
	const navigate = useNavigate();
	const {
		selectedRole,
		schoolDomain,
		hasSeenOnboarding,
		login: loginAction,
	} = useAuthStore();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
	});

	// Redirect if missing required flow data
	if (!selectedRole || !schoolDomain) {
		navigate("/");
		return null;
	}

	// 3. The function that runs on successful form submission
	const onSubmit = async (data: LoginFormValues) => {
		try {
			const { user } = await loginApi(data, selectedRole, schoolDomain);
			loginAction(user);

			// Navigate based on whether user has seen onboarding
			if (hasSeenOnboarding) {
				navigate("/dashboard");
			} else {
				navigate("/onboarding");
			}
		} catch (error) {
			console.error("Login failed:", error);
			// TODO: Add user-facing error message (e.g., a toast notification)
		}
	};

	return (
		<div className="space-y-6">
			{/* School and role context */}
			<div className="text-center border-b pb-4">
				<p className="text-sm text-gray-600">
					Signing in to <span className="font-medium">{schoolDomain}</span> as a{" "}
					<span className="font-medium text-orange-600">
						{selectedRole.toLowerCase()}
					</span>
				</p>
				<button
					onClick={() => navigate("/school-setup")}
					className="text-xs text-gray-500 hover:text-gray-700 mt-1"
					type="button">
					Change school or role
				</button>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-4">
				<div className="space-y-2">
					<label
						htmlFor="email"
						className="text-sm font-medium">
						Email
					</label>
					<input
						id="email"
						type="email"
						{...register("email")}
						className="w-full p-3 border rounded-md"
						placeholder="email@example.com"
					/>
					{errors.email && (
						<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
					)}
				</div>
				<div className="space-y-2">
					<label
						htmlFor="password"
						className="text-sm font-medium">
						Password
					</label>
					<input
						id="password"
						type="password"
						{...register("password")}
						className="w-full p-3 border rounded-md"
					/>
					{errors.password && (
						<p className="text-red-500 text-sm mt-1">
							{errors.password.message}
						</p>
					)}
				</div>
				<div className="flex items-center justify-between text-sm">
					<label className="flex items-center gap-2 font-medium">
						<input
							type="checkbox"
							className="rounded"
						/>
						Remember me
					</label>
					<a
						href="#"
						className="font-medium text-primary hover:underline">
						Forgot password?
					</a>
				</div>
				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full bg-orange-500 text-white p-3 rounded-md font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50">
					{isSubmitting ? "Signing In..." : "Login"}
				</button>
			</form>
		</div>
	);
};
