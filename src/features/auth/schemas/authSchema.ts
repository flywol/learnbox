import { z } from "zod";

// ===== COMMON SCHEMAS =====

// Email schema - reusable
export const emailSchema = z
	.string()
	.min(1, "Email is required")
	.email("Please enter a valid email address")
	.toLowerCase();

// Password schema - base password requirements
export const passwordSchema = z
	.string()
	.min(1, "Password is required")
	.min(8, "Password must be at least 8 characters")
	.regex(/[0-9]/, "Password must contain at least one number")
	.regex(
		/[^A-Za-z0-9]/,
		"Password must contain at least one special character"
	);

// Phone number schema
export const phoneNumberSchema = z
	.string()
	.min(1, "Phone number is required")
	.regex(/^\d{10}$/, "Phone number must be 10 digits");

// OTP schema
export const otpSchema = z.object({
	otp: z
		.string()
		.length(6, "OTP must be 6 digits")
		.regex(/^\d{6}$/, "OTP must contain only digits"),
});

// ===== LOGIN SCHEMAS =====

export const loginSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, "Password is required"),
	rememberMe: z.boolean().optional(),
});

// ===== SIGNUP SCHEMAS =====

export const schoolInfoSchema = z.object({
	name: z.string().min(1, "School name is required"),
	shortName: z
		.string()
		.min(1, "School short name is required")
		.regex(/^[a-zA-Z0-9]+$/, "Only letters and numbers allowed"),
	website: z
		.string()
		.min(1, "School website is required")
		.url("Please enter a valid URL"),
});

export const personalInfoSchema = z.object({
	fullName: z
		.string()
		.min(1, "Full name is required")
		.min(2, "Full name must be at least 2 characters"),
	email: emailSchema,
	phoneNumber: phoneNumberSchema,
	password: passwordSchema,
});

// ===== SCHOOL SETUP SCHEMAS =====

export const schoolSetupSchema = z.object({
	schoolUrl: z
		.string()
		.min(1, "Please enter your school's URL")
		.refine(
			(url) => {
				// Allow various formats: domain.com, subdomain.domain.com, https://domain.com
				const urlPattern = /^(https?:\/\/)?([\w\-]+\.)*[\w\-]+\.[a-z]{2,}$/i;
				return urlPattern.test(url);
			},
			{ message: "Please enter a valid school URL" }
		),
});

// ===== PASSWORD RESET SCHEMAS =====

export const forgotPasswordSchema = z.object({
	email: emailSchema,
});

export const resetPasswordSchema = z
	.object({
		password: passwordSchema,
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

// ===== ROLE SELECTION SCHEMA =====

export const roleSelectionSchema = z.object({
	role: z.enum(["STUDENT", "PARENT", "ADMIN", "TEACHER"], {
		required_error: "Please select a role",
	}),
});

// ===== TYPE EXPORTS =====

// Login types
export type LoginFormData = z.infer<typeof loginSchema>;

// Signup types
export type SchoolInfoFormData = z.infer<typeof schoolInfoSchema>;
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;

// School setup types
export type SchoolSetupFormData = z.infer<typeof schoolSetupSchema>;

// Password reset types
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Role selection types
export type RoleSelectionFormData = z.infer<typeof roleSelectionSchema>;

// ===== VALIDATION HELPERS =====

// Helper to validate email format without full schema
export const isValidEmail = (email: string): boolean => {
	const result = emailSchema.safeParse(email);
	return result.success;
};

// Helper to check password strength
export const getPasswordStrength = (
	password: string
): "weak" | "medium" | "strong" => {
	if (password.length < 8) return "weak";

	const hasNumber = /[0-9]/.test(password);
	const hasSpecial = /[^A-Za-z0-9]/.test(password);
	const hasUpper = /[A-Z]/.test(password);
	const hasLower = /[a-z]/.test(password);

	const score = [hasNumber, hasSpecial, hasUpper, hasLower].filter(
		Boolean
	).length;

	if (score <= 2) return "weak";
	if (score === 3) return "medium";
	return "strong";
};
