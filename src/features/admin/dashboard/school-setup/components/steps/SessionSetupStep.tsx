// src/features/dashboard/school-setup/components/steps/SessionSetupStep.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, CalendarDays, BookOpen, Clock } from "lucide-react";
import { useSessionStore } from "../../store/sessionStore";
import schoolSetupApiClient from "@/features/admin/dashboard/api/schoolSetupApiClient";

// Session validation schema
const sessionSchema = z.object({
  name: z.string().min(1, "Session name is required"),
  firstTermName: z.string().min(1, "First term name is required"),
  secondTermName: z.string().min(1, "Second term name is required"),
  thirdTermName: z.string().min(1, "Third term name is required"),
  firstTermStartDate: z.string().min(1, "First term start date is required"),
  firstTermEndDate: z.string().min(1, "First term end date is required"),
  secondTermStartDate: z.string().min(1, "Second term start date is required"),
  secondTermEndDate: z.string().min(1, "Second term end date is required"),
  thirdTermStartDate: z.string().min(1, "Third term start date is required"),
  thirdTermEndDate: z.string().min(1, "Third term end date is required"),
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface SessionSetupStepProps {
  onComplete?: () => void;
}

const SessionSetupStep = ({ onComplete }: SessionSetupStepProps) => {
  const {
    sessionData,
    updateSessionData,
    isSubmitting,
    apiError,
    setSubmitting,
    setApiError,
    clearApiError,
    clearStorageAfterSubmission,
  } = useSessionStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: sessionData.name || "",
      firstTermName: sessionData.firstTermName || "First Term",
      secondTermName: sessionData.secondTermName || "Second Term",
      thirdTermName: sessionData.thirdTermName || "Third Term",
      firstTermStartDate: sessionData.firstTermStartDate || "",
      firstTermEndDate: sessionData.firstTermEndDate || "",
      secondTermStartDate: sessionData.secondTermStartDate || "",
      secondTermEndDate: sessionData.secondTermEndDate || "",
      thirdTermStartDate: sessionData.thirdTermStartDate || "",
      thirdTermEndDate: sessionData.thirdTermEndDate || "",
    },
  });

  // Watch form values and update store
  const formValues = watch();
  useEffect(() => {
    updateSessionData(formValues);
  }, [formValues, updateSessionData]);

  const handleFormSubmit = async (data: SessionFormData) => {
    setSubmitting(true);
    clearApiError();

    try {
      await schoolSetupApiClient.createSession(data);
      
      // Update store with successful data
      updateSessionData(data);
      
      // Clear storage after successful submission to avoid crowding storage
      clearStorageAfterSubmission();
      
      // Call completion callback
      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      setApiError(error.message || "Failed to create session");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Set Up Academic Session
        </h2>
        <p className="text-gray-600">
          Configure your academic year and term dates
        </p>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Session Name */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Session Information
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Name *
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 2024/2025"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Term Configuration */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <CalendarDays className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Term Configuration
            </h3>
          </div>

          <div className="space-y-6">
            {/* First Term */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">First Term</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Term Name *
                  </label>
                  <input
                    type="text"
                    {...register("firstTermName")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                  {errors.firstTermName && (
                    <p className="text-red-600 text-sm mt-1">{errors.firstTermName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    {...register("firstTermStartDate")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                  {errors.firstTermStartDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.firstTermStartDate.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    {...register("firstTermEndDate")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                  {errors.firstTermEndDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.firstTermEndDate.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Second Term */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Second Term</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Term Name *
                  </label>
                  <input
                    type="text"
                    {...register("secondTermName")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                  {errors.secondTermName && (
                    <p className="text-red-600 text-sm mt-1">{errors.secondTermName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    {...register("secondTermStartDate")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                  {errors.secondTermStartDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.secondTermStartDate.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    {...register("secondTermEndDate")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                  {errors.secondTermEndDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.secondTermEndDate.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Third Term */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Third Term</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Term Name *
                  </label>
                  <input
                    type="text"
                    {...register("thirdTermName")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                  {errors.thirdTermName && (
                    <p className="text-red-600 text-sm mt-1">{errors.thirdTermName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    {...register("thirdTermStartDate")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                  {errors.thirdTermStartDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.thirdTermStartDate.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    {...register("thirdTermEndDate")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                  {errors.thirdTermEndDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.thirdTermEndDate.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Session...
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                Create Academic Session
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SessionSetupStep;