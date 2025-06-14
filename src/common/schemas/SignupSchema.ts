// schemas/signupSchemas.ts
import { z } from "zod";

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

export const otpSchema = z.object({
	otp: z
		.string()
		.length(6, "OTP must be 6 digits")
		.regex(/^\d{6}$/, "OTP must contain only digits"),
});

// Export types
export type SchoolInfoFormData = z.infer<typeof schoolInfoSchema>;
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
