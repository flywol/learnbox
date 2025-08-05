import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Calendar, X, Plus } from "lucide-react";
import { useSessionConfiguration, useUpdateSessionConfig } from "../hooks/useProfile";

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

  // Fetch current session configuration
  const { data: sessionConfig, isLoading } = useSessionConfiguration();
  const updateSessionMutation = useUpdateSessionConfig();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SessionConfigFormData>({
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

  const onSubmit = async (data: SessionConfigFormData) => {
    try {
      await updateSessionMutation.mutateAsync(data);
      navigate("/profile");
    } catch (error) {
      console.error("Failed to update session configuration:", error);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };


  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading session configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={handleCancel}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-lg font-medium">Session & Term Configuration</span>
        </button>
      </div>

      {/* Error Message */}
      {updateSessionMutation.isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">
            {updateSessionMutation.error?.message || "Failed to update session configuration. Please try again."}
          </p>
        </div>
      )}

      {/* Configuration Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Session Selection */}
          <div className="max-w-sm">
            <input
              type="text"
              {...register("name")}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Select session"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Terms Configuration - Fixed 3 terms */}
          <div className="space-y-4">
            {/* First Term */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  {...register("firstTermName")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.firstTermName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="First Term"
                />
                {errors.firstTermName && (
                  <p className="text-xs text-red-600 mt-1">{errors.firstTermName.message}</p>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  {...register("firstTermStartDate")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.firstTermStartDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="First term start date *"
                  onFocus={(e) => { e.target.type = 'date'; }}
                  onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <X className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                {errors.firstTermStartDate && (
                  <p className="text-xs text-red-600 mt-1">{errors.firstTermStartDate.message}</p>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  {...register("firstTermEndDate")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.firstTermEndDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="First term end date *"
                  onFocus={(e) => { e.target.type = 'date'; }}
                  onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <X className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                {errors.firstTermEndDate && (
                  <p className="text-xs text-red-600 mt-1">{errors.firstTermEndDate.message}</p>
                )}
              </div>
            </div>

            {/* Second Term */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  {...register("secondTermName")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.secondTermName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Second Term"
                />
                {errors.secondTermName && (
                  <p className="text-xs text-red-600 mt-1">{errors.secondTermName.message}</p>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  {...register("secondTermStartDate")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.secondTermStartDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Second term start date *"
                  onFocus={(e) => { e.target.type = 'date'; }}
                  onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <X className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                {errors.secondTermStartDate && (
                  <p className="text-xs text-red-600 mt-1">{errors.secondTermStartDate.message}</p>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  {...register("secondTermEndDate")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.secondTermEndDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Second term end date *"
                  onFocus={(e) => { e.target.type = 'date'; }}
                  onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <X className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                {errors.secondTermEndDate && (
                  <p className="text-xs text-red-600 mt-1">{errors.secondTermEndDate.message}</p>
                )}
              </div>
            </div>

            {/* Third Term */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  {...register("thirdTermName")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.thirdTermName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Third Term"
                />
                {errors.thirdTermName && (
                  <p className="text-xs text-red-600 mt-1">{errors.thirdTermName.message}</p>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  {...register("thirdTermStartDate")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.thirdTermStartDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Third term start date *"
                  onFocus={(e) => { e.target.type = 'date'; }}
                  onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <X className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                {errors.thirdTermStartDate && (
                  <p className="text-xs text-red-600 mt-1">{errors.thirdTermStartDate.message}</p>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  {...register("thirdTermEndDate")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.thirdTermEndDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Third term end date *"
                  onFocus={(e) => { e.target.type = 'date'; }}
                  onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <X className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                {errors.thirdTermEndDate && (
                  <p className="text-xs text-red-600 mt-1">{errors.thirdTermEndDate.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Roll Over Data */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="rollOverData"
              {...register("rollOverData")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="rollOverData" className="text-sm text-blue-600 cursor-pointer underline">
              Roll over data from current session/term
            </label>
          </div>

          {/* Update Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={updateSessionMutation.isPending}
              className="w-full max-w-md px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {updateSessionMutation.isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}