// src/features/school-setup/components/SchoolSetupPromptModal.tsx
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";

interface SchoolSetupPromptModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function SchoolSetupPromptModal({
	isOpen,
	onClose,
}: SchoolSetupPromptModalProps) {
	const navigate = useNavigate();
	const { user } = useAuthStore();

	if (!isOpen) return null;

	const handleContinue = () => {
		onClose();
		navigate("/dashboard/complete-school-setup");
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-8">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
					<X className="w-5 h-5" />
				</button>

				<div className="text-center">
					{/* Icon */}
					<div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<svg
							className="w-10 h-10 text-orange-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							/>
						</svg>
					</div>

					{/* Content */}
					<h2 className="text-2xl font-bold text-gray-900 mb-3">
						Welcome {user?.fullName || 'Admin'}, complete your school registration.
					</h2>

					<p className="text-gray-600 mb-8">
						Let's finish setting up your school to get the most out of LearnBox.
					</p>

					{/* Actions */}
					<div className="flex gap-3">
						<button
							onClick={onClose}
							className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
							Later
						</button>
						<button
							onClick={handleContinue}
							className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
							Continue
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
