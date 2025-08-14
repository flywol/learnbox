// src/features/dashboard/school-setup/pages/CompleteSetupPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { ChevronRight, Save } from "lucide-react";
import AddClassArmsStep from "../components/steps/AddClassArmsStep";
import AddClassLevelsStep from "../components/steps/AddClassLevelsStep";
import CreateSessionStep from "../components/steps/CreateSessionStep";
import SchoolInfoStep from "../components/steps/CompleteSchoolInfoStep";
import { useSchoolSetupStore } from "../store/schoolSetupStore";

const steps = [
	{ number: 1, title: "School Information", component: SchoolInfoStep },
	{ number: 2, title: "Create Session", component: CreateSessionStep },
	{ number: 3, title: "Add Class Level", component: AddClassLevelsStep },
	{ number: 4, title: "Add Class Arm", component: AddClassArmsStep },
];

export default function CompleteSetupPage() {
	const navigate = useNavigate();
	const {
		currentStep,
		isCompleted,
		hasUnsavedChanges,
		lastSavedAt,
		markAsCompleted,
		clearStorageAfterCompletion,
		saveDraft,
	} = useSchoolSetupStore();

	const CurrentStepComponent = steps[currentStep - 1].component;

	// Redirect if already completed
	useEffect(() => {
		if (isCompleted) {
			navigate("/dashboard");
		}
	}, [isCompleted, navigate]);

	const handleSaveDraft = async () => {
		try {
			saveDraft();
			// Could also call API to save draft here if needed
		} catch (error) {
		}
	};

	const handleComplete = async () => {
		// This is called from the final step (AddClassArmsStep)
		// The API calls are handled there
		markAsCompleted();
		
		// Clear storage after successful completion to avoid crowding storage
		clearStorageAfterCompletion();
		
		navigate("/dashboard");
	};

	const formatLastSaved = () => {
		if (!lastSavedAt) return "Never saved";
		const now = new Date();
		const saved = new Date(lastSavedAt);
		const diffInMinutes = Math.floor((now.getTime() - saved.getTime()) / 60000);

		if (diffInMinutes < 1) return "Saved just now";
		if (diffInMinutes < 60) return `Saved ${diffInMinutes} minutes ago`;

		return saved.toLocaleString();
	};

	if (isCompleted) {
		return null; // Will redirect
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<button
								onClick={() => navigate("/dashboard")}
								className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 19l-7-7 7-7"
									/>
								</svg>
								Back to Dashboard
							</button>
							<h1 className="text-2xl font-bold text-gray-900">School Setup</h1>
						</div>

						<div className="flex items-center gap-4">
							{/* Save Status */}
							<div className="text-sm text-gray-600">
								{hasUnsavedChanges ? (
									<span className="text-orange-600">● Unsaved changes</span>
								) : (
									<span className="text-green-600">✓ {formatLastSaved()}</span>
								)}
							</div>

							{/* Save Draft Button */}
							<button
								onClick={handleSaveDraft}
								className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
								<Save className="w-4 h-4" />
								Save Draft
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Progress Steps */}
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center justify-between">
						{steps.map((step, index) => (
							<div
								key={step.number}
								className="flex items-center">
								<div className="flex items-center">
									<div
										className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                      ${
												currentStep > step.number
													? "bg-green-500 text-white"
													: currentStep === step.number
													? "bg-orange-500 text-white"
													: "bg-gray-200 text-gray-600"
											}
                    `}>
										{currentStep > step.number ? (
											<svg
												className="w-5 h-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										) : (
											step.number
										)}
									</div>
									<span
										className={`ml-3 text-sm font-medium transition-colors ${
											currentStep >= step.number
												? "text-gray-900"
												: "text-gray-500"
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
			</div>

			{/* Step Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<CurrentStepComponent
					onComplete={currentStep === 4 ? handleComplete : undefined}
				/>
			</div>

			{/* Progress Bar */}
			{/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-center justify-between text-sm text-gray-600">
						<span>
							Step {currentStep} of {steps.length}
						</span>
						<span>
							{Math.round((currentStep / steps.length) * 100)}% Complete
						</span>
					</div>
					<div className="mt-2 w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-orange-500 h-2 rounded-full transition-all duration-300"
							style={{ width: `${(currentStep / steps.length) * 100}%` }}
						/>
					</div>
				</div>
			</div> */}
		</div>
	);
}
