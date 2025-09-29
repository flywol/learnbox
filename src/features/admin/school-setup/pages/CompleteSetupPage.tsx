import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddClassArmsStep from "../components/steps/AddClassArmsStep";
import AddClassLevelsStep from "../components/steps/AddClassLevelsStep";
import CreateSessionStep from "../components/steps/CreateSessionStep";
import SchoolInfoStep from "../components/steps/CompleteSchoolInfoStep";
import { useSchoolSetupStore } from "../store/schoolSetupStore";
import ProgressIndicator from "../components/ProgressIndicator";
import SetupHeader from "../components/SetupHeader";

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
		markAsCompleted,
		clearStorageAfterCompletion,
	} = useSchoolSetupStore();

	const CurrentStepComponent = steps[currentStep - 1].component;

	// Redirect if already completed
	useEffect(() => {
		if (isCompleted) {
			navigate("/admin/dashboard");
		}
	}, [isCompleted, navigate]);

	const handleComplete = async () => {
		// This is called from the final step (AddClassArmsStep)
		// The API calls are handled there
		markAsCompleted();
		
		// Clear storage after successful completion to avoid crowding storage
		clearStorageAfterCompletion();
		
		navigate("/admin/dashboard");
	};

	if (isCompleted) {
		return null; // Will redirect
	}

	return (
		<div className="space-y-6">
			<SetupHeader />
			<ProgressIndicator steps={steps} currentStep={currentStep} />
			<CurrentStepComponent
				onComplete={currentStep === 4 ? handleComplete : undefined}
			/>
		</div>
	);
}
