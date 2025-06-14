// Re-export all schemas and types from authSchemas
export * from "./authSchema";

// Group related schemas for easier imports
export {
	// Login related
	loginSchema,
	type LoginFormData,

	// Signup related
	schoolInfoSchema,
	personalInfoSchema,
	otpSchema,
	type SchoolInfoFormData,
	type PersonalInfoFormData,
	type OtpFormData,

	// Password reset related
	forgotPasswordSchema,
	resetPasswordSchema,
	type ForgotPasswordFormData,
	type ResetPasswordFormData,

	// Other
	schoolSetupSchema,
	roleSelectionSchema,
	type SchoolSetupFormData,
	type RoleSelectionFormData,

	// Helpers
	isValidEmail,
	getPasswordStrength,
} from "./authSchema";
