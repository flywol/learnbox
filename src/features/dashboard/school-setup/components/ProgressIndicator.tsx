import { ChevronRight } from "lucide-react";

interface Step {
  number: number;
  title: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                ${currentStep > step.number
                  ? "bg-green-500 text-white"
                  : currentStep === step.number
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-600"
                }
              `}>
                {currentStep > step.number ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span className={`ml-3 text-sm font-medium ${
                currentStep === step.number ? 'text-orange-600' : 'text-gray-700'
              }`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="mx-4 w-5 h-5 text-gray-400" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}