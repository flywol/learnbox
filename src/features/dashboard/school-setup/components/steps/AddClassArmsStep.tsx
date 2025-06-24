// src/features/school-setup/components/steps/AddClassArmsStep.tsx
import { useState } from "react";
import { useSchoolSetupStore } from "../../store/schoolSetupStore";
import { Trash2 } from "lucide-react";
import CustomArmModal from "../CustomArmModal";

interface ClassArmsProps {
	onComplete?: () => void;
}

export default function AddClassArmsStep({ onComplete }: ClassArmsProps) {
	const {
		selectedClassLevels,
		classArms,
		updateClassArms,
		addCustomArm,
		previousStep,
	} = useSchoolSetupStore();

	const [showCustomModal, setShowCustomModal] = useState(false);
	const [selectedClassForCustom, setSelectedClassForCustom] =
		useState<string>("");
	const [editingArms, setEditingArms] = useState<{ [key: string]: string[] }>(
		{}
	);

	// Get only selected class levels
	const activeClassLevels = selectedClassLevels.filter(
		(level) => level.selected
	);

	// Default arms based on class type
	const getDefaultArms = (classId: string) => {
		if (classId.includes("sss")) {
			return ["Science", "Commercial", "Humanities"];
		}
		return ["A", "B", "C", "D"];
	};

	const handleArmToggle = (classId: string, arm: string) => {
		const currentArms =
			editingArms[classId] ||
			classArms.find((ca) => ca.classId === classId)?.arms ||
			[];
		const newArms = currentArms.includes(arm)
			? currentArms.filter((a) => a !== arm)
			: [...currentArms, arm];

		setEditingArms((prev) => ({ ...prev, [classId]: newArms }));
		updateClassArms(classId, newArms);
	};

	const handleCustomArmClick = (classId: string) => {
		setSelectedClassForCustom(classId);
		setShowCustomModal(true);
	};

	const handleAddCustomArm = (armName: string) => {
		if (selectedClassForCustom) {
			addCustomArm(selectedClassForCustom, armName);
			// Also add it to current arms
			const currentArms =
				editingArms[selectedClassForCustom] ||
				classArms.find((ca) => ca.classId === selectedClassForCustom)?.arms ||
				[];
			updateClassArms(selectedClassForCustom, [...currentArms, armName]);
		}
		setShowCustomModal(false);
	};

	const getClassArms = (classId: string) => {
		const classArm = classArms.find((ca) => ca.classId === classId);
		return {
			defaultArms: getDefaultArms(classId),
			selectedArms: editingArms[classId] || classArm?.arms || [],
			customArms: classArm?.customArms || [],
		};
	};

	const handleComplete = () => {
		if (onComplete) {
			onComplete();
		}
	};

	return (
		<div className="space-y-8">
			<div className="bg-white rounded-lg shadow p-6">
				<h2 className="text-xl font-semibold mb-6">Add Class Arms</h2>
				<p className="text-gray-600 mb-8">
					Select or customize arms for each class level
				</p>

				<div className="space-y-6">
					{activeClassLevels.map((level) => {
						const { defaultArms, selectedArms, customArms } = getClassArms(
							level.id
						);
						const allArms = [...defaultArms, ...customArms];

						return (
							<div
								key={level.id}
								className="border rounded-lg p-4">
								<h3 className="font-medium text-gray-900 mb-4">{level.name}</h3>

								<div className="flex flex-wrap gap-3">
									{allArms.map((arm) => {
										const isSelected = selectedArms.includes(arm);
										const isCustom = customArms.includes(arm);

										return (
											<label
												key={arm}
												className={`
                          relative flex items-center px-4 py-2 rounded-lg border cursor-pointer transition-colors
                          ${
														isSelected
															? "bg-orange-50 border-orange-500 text-orange-700"
															: "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
													}
                        `}>
												<input
													type="checkbox"
													checked={isSelected}
													onChange={() => handleArmToggle(level.id, arm)}
													className="sr-only"
												/>
												<span className="font-medium">{arm}</span>
												{isCustom && (
													<button
														onClick={(e) => {
															e.preventDefault();
															// Remove custom arm logic here if needed
														}}
														className="ml-2 text-red-500 hover:text-red-700">
														<Trash2 className="w-3 h-3" />
													</button>
												)}
											</label>
										);
									})}

									<button
										type="button"
										onClick={() => handleCustomArmClick(level.id)}
										className="flex items-center gap-2 px-4 py-2 text-orange-500 hover:text-orange-600">
										<span>Customize your class arms</span>
									</button>
								</div>

								{selectedArms.length === 0 && (
									<p className="mt-2 text-sm text-red-600">
										Please select at least one arm for this class
									</p>
								)}
							</div>
						);
					})}
				</div>

				{/* Actions */}
				<div className="flex justify-between mt-8">
					<button
						type="button"
						onClick={previousStep}
						className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
						Back
					</button>
					<button
						type="button"
						onClick={handleComplete}
						className="px-8 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
						Complete
					</button>
				</div>
			</div>

			{/* Custom Arm Modal */}
			{showCustomModal && (
				<CustomArmModal
					isOpen={showCustomModal}
					onClose={() => setShowCustomModal(false)}
					onSubmit={handleAddCustomArm}
					className={
						activeClassLevels.find((l) => l.id === selectedClassForCustom)
							?.name || ""
					}
				/>
			)}
		</div>
	);
}
