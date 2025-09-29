import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSessionConfiguration, useUpdateSessionConfig } from "../hooks/useProfile";
import PageHeader from "../components/school-info/PageHeader";
import TextInputField from "../components/session-config/TextInputField";
import TermConfigSection from "../components/session-config/TermConfigSection";
import SessionHistorySection from "../components/session-config/SessionHistorySection";
import RollOverSection from "../components/session-config/RollOverSection";

const sessionConfigSchema = z.object({
  name: z.string().min(1, "Session name is required"),
  firstTermName: z.string().min(1, "First term name is required"),
  firstTermStartDate: z.string().min(1, "First term start date is required"),
  firstTermEndDate: z.string().min(1, "First term end date is required"),
  secondTermName: z.string().min(1, "Second term name is required"),
  secondTermStartDate: z.string().min(1, "Second term start date is required"),
  secondTermEndDate: z.string().min(1, "Second term end date is required"),
  thirdTermName: z.string().min(1, "Third term name is required"),
  thirdTermStartDate: z.string().min(1, "Third term start date is required"),
  thirdTermEndDate: z.string().min(1, "Third term end date is required"),
  rollOverData: z.boolean(),
});

type SessionConfigFormData = z.infer<typeof sessionConfigSchema>;

export default function SessionConfigPage() {
  const navigate = useNavigate();
  const { data: sessionConfig, isLoading } = useSessionConfiguration();
  const updateSessionMutation = useUpdateSessionConfig();

  const { register, handleSubmit, formState: { errors } } = useForm<SessionConfigFormData>({
    resolver: zodResolver(sessionConfigSchema),
    values: sessionConfig ? {
      name: sessionConfig.currentSession.name || "",
      firstTermName: sessionConfig.currentSession.terms[0]?.name || "First term",
      firstTermStartDate: sessionConfig.currentSession.terms[0]?.startDate || "",
      firstTermEndDate: sessionConfig.currentSession.terms[0]?.endDate || "",
      secondTermName: sessionConfig.currentSession.terms[1]?.name || "Second term",
      secondTermStartDate: sessionConfig.currentSession.terms[1]?.startDate || "",
      secondTermEndDate: sessionConfig.currentSession.terms[1]?.endDate || "",
      thirdTermName: sessionConfig.currentSession.terms[2]?.name || "Third term",
      thirdTermStartDate: sessionConfig.currentSession.terms[2]?.startDate || "",
      thirdTermEndDate: sessionConfig.currentSession.terms[2]?.endDate || "",
      rollOverData: false
    } : {
      name: "",
      firstTermName: "First term",
      firstTermStartDate: "",
      firstTermEndDate: "",
      secondTermName: "Second term",
      secondTermStartDate: "",
      secondTermEndDate: "",
      thirdTermName: "Third term",
      thirdTermStartDate: "",
      thirdTermEndDate: "",
      rollOverData: false
    }
  });

  const onSubmit = (data: SessionConfigFormData) => {
    updateSessionMutation.mutate(data, {
      onSuccess: () => {
        navigate("/admin/profile");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading session configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader 
        title="Session & Term Configuration" 
        onBack={() => navigate("/admin/profile")} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Configuration Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Session Name */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Session Information</h2>
                <TextInputField
                  name="name"
                  placeholder="Session Name (e.g., 2024/2025) *"
                  register={register}
                  errors={errors}
                />
              </div>

              {/* Terms Configuration */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Terms Configuration</h2>
                <div className="space-y-6">
                  <TermConfigSection termNumber="first" register={register} errors={errors} />
                  <TermConfigSection termNumber="second" register={register} errors={errors} />
                  <TermConfigSection termNumber="third" register={register} errors={errors} />
                </div>
              </div>

              {/* Roll Over Data */}
              <RollOverSection register={register} />

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={updateSessionMutation.isPending}
                  className="w-full max-w-md px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {updateSessionMutation.isPending ? "Updating..." : "Update Session Configuration"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Past Sessions Sidebar */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <SessionHistorySection pastSessions={sessionConfig?.sessions || []} />
          </div>
        </div>
      </div>
    </div>
  );
}