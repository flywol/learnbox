// src/features/school-setup/pages/SchoolSetupPage.tsx
import { useNavigate } from "react-router-dom";
import { useSchoolSetupStore } from "../store/schoolSetupStore";
import SchoolInfoStep from "../components/steps/SchoolInfoStep";
import CreateSessionStep from "../components/steps/CreateSessionStep";
import AddClassLevelsStep from "../components/steps/AddClassLevelsStep";
import AddClassArmsStep from "../components/steps/AddClassArmsStep";
import { ChevronRight } from "lucide-react";

const steps = [
	{ number: 1, title: "School Information", component: SchoolInfoStep },
	{ number: 2, title: "Create Session", component: CreateSessionStep },
	{ number: 3, title: "Add Class Level", component: AddClassLevelsStep },
	{ number: 4, title: "Add Class Arm", component: AddClassArmsStep },
];

export default function SchoolSetupPage() {
	const navigate = useNavigate();
	const { currentStep, isCompleted, markAsCompleted, saveDraft } =
		useSchoolSetupStore();

	const CurrentStepComponent = steps[currentStep - 1].component;

	const handleComplete = async () => {
		// Save all data to backend
		await saveDraft();
		markAsCompleted();
		navigate("/dashboard");
	};

	if (isCompleted) {
		navigate("/dashboard");
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<h1 className="text-2xl font-bold text-gray-900">School Setup</h1>
						</div>
						<button
							onClick={saveDraft}
							className="text-sm text-gray-600 hover:text-gray-900">
							Save Draft
						</button>
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
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                      ${
												currentStep >= step.number
													? "bg-green-500 text-white"
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
										className={`ml-3 text-sm font-medium ${
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
		</div>
	);
}
