import { UseFormReturn } from "react-hook-form";
import { SchoolSetupFormData } from "../../../schemas/authSchema";

interface SchoolDomainStepProps {
  form: UseFormReturn<SchoolSetupFormData>;
  onSubmit: (data: SchoolSetupFormData) => Promise<void>;
  isVisible: boolean;
  isValidating: boolean;
}

export default function SchoolDomainStep({
  form,
  onSubmit,
  isVisible,
  isValidating,
}: SchoolDomainStepProps) {
  return (
    <div
      className={`w-full max-w-sm space-y-6 absolute transition-transform duration-500 ease-in-out ${
        isVisible ? "translate-x-0" : "-translate-x-full opacity-0"
      }`}
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to stay connected.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <input
            id="schoolUrl"
            type="text"
            {...form.register("schoolUrl")}
            className="w-full p-3 border rounded-md"
            placeholder="e.g., school.learnbox.com or https://school.learnbox.com"
            disabled={isValidating}
          />
          {form.formState.errors.schoolUrl && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.schoolUrl.message}
            </p>
          )}
        </div>

        <div className="text-right">
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Need help?
          </a>
        </div>

        <button
          type="submit"
          disabled={isValidating}
          className="w-full bg-orange-500 text-white p-3 rounded-md font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {isValidating ? "Validating..." : "Next"}
        </button>
      </form>
    </div>
  );
}