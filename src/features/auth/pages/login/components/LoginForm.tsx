import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "../../../schemas/authSchema";
import PasswordInput from "@/features/auth/components/PasswordInput";

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  form: UseFormReturn<LoginFormValues>;
  onSubmit: (data: LoginFormValues) => Promise<void>;
  onForgotPassword: () => void;
  onBackToSchool: () => void;
  isVisible: boolean;
  isLoggingIn: boolean;
  schoolDomain: string | null;
  selectedRole: string;
  message?: string;
  loginError?: string | null;
}

export default function LoginForm({
  form,
  onSubmit,
  onForgotPassword,
  onBackToSchool,
  isVisible,
  isLoggingIn,
  schoolDomain,
  selectedRole,
  message,
  loginError,
}: LoginFormProps) {
  return (
    <div
      className={`w-full max-w-sm space-y-6 absolute transition-transform duration-500 ease-in-out ${
        isVisible ? "translate-x-0" : "translate-x-full opacity-0"
      }`}
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to stay connected.
        </p>
        {schoolDomain && (
          <p className="mt-1 text-sm text-gray-600">
            {schoolDomain} • {selectedRole.toLowerCase()}
          </p>
        )}
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
          {message}
        </div>
      )}

      {loginError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {loginError}
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <input
            id="email"
            type="email"
            {...form.register("email")}
            className="w-full p-3 border rounded-md"
            placeholder="Email"
            disabled={isLoggingIn}
          />
          {form.formState.errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <PasswordInput
            id="password"
            name="password"
            register={form.register}
            placeholder="Password"
            disabled={isLoggingIn}
            error={!!form.formState.errors.password}
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...form.register("rememberMe")}
              className="rounded"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-gray-500 hover:text-gray-700"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full bg-orange-500 text-white p-3 rounded-md font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {isLoggingIn ? "Signing in..." : "Login"}
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={onBackToSchool}
          className="text-sm text-gray-500 hover:text-gray-700"
          disabled={isLoggingIn}
        >
          ← Change school
        </button>
      </div>
    </div>
  );
}