// src/features/school-setup/components/CustomArmModal.tsx
import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";

interface CustomArmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (armNames: string[]) => void;
	className: string;
}

export default function CustomArmModal({
	isOpen,
	onClose,
	onSubmit,
	className,
}: CustomArmModalProps) {
	const [arms, setArms] = useState([
		{ id: 1, name: "" },
	]);
	const [nextId, setNextId] = useState(2);

	if (!isOpen) return null;

	const handleAddArm = () => {
		setArms([...arms, { id: nextId, name: "" }]);
		setNextId(nextId + 1);
	};

	const handleRemoveArm = (id: number) => {
		setArms(arms.filter((arm) => arm.id !== id));
	};

	const handleArmNameChange = (id: number, name: string) => {
		setArms(arms.map((arm) => (arm.id === id ? { ...arm, name } : arm)));
	};

	const handleSubmit = () => {
		const validArms = arms
			.map((arm) => arm.name.trim())
			.filter((name) => name.length > 0);
		
		if (validArms.length > 0) {
			onSubmit(validArms);
		}
		onClose();
	};

	const handleCancel = () => {
		setArms([
			{ id: 1, name: "" },
		]);
		setNextId(2);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50"
				onClick={handleCancel}
			/>

			{/* Modal */}
			<div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-semibold">Customize your class arms</h3>
					<button
						onClick={handleCancel}
						className="text-gray-400 hover:text-gray-600">
						<X className="w-5 h-5" />
					</button>
				</div>

				<p className="text-sm text-gray-600 mb-6">
					Add custom arm names for {className}
				</p>

				<div className="space-y-3 mb-6">
					{arms.map((arm, index) => (
						<div
							key={arm.id}
							className="flex items-center gap-3">
							<span className="text-sm text-gray-500 w-12">
								Arm {index + 1}
							</span>
							<input
								type="text"
								value={arm.name}
								onChange={(e) => handleArmNameChange(arm.id, e.target.value)}
								placeholder="Write the arm name"
								className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
								autoFocus={index === 0}
							/>
							<button
								onClick={() => handleRemoveArm(arm.id)}
								className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
								disabled={arms.length === 1}>
								<Minus className="w-4 h-4" />
							</button>
							{index === arms.length - 1 && (
								<button
									onClick={handleAddArm}
									className="p-2 text-green-500 hover:bg-green-50 rounded-lg">
									<Plus className="w-4 h-4" />
								</button>
							)}
						</div>
					))}
				</div>

				<div className="flex gap-3">
					<button
						onClick={handleCancel}
						className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
						Cancel & go back
					</button>
					<button
						onClick={handleSubmit}
						className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600">
						Submit
					</button>
				</div>
			</div>
		</div>
	);
}
