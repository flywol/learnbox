interface SuccessStepProps {
	onClose: () => void;
	onContinue: () => void;
}

export function SuccessStep({ onClose, onContinue }: SuccessStepProps) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="w-full max-w-2xl px-8">
				<div>
					<button
						onClick={onClose}
						className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>

					<div className="flex justify-center mb-8">
						<div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
							<svg
								className="w-12 h-12 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={3}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
					</div>

					<h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
						Congratulations! You've successfully created your school.
					</h2>

					<button
						onClick={onContinue}
						className="w-full max-w-sm mx-auto block bg-orange-500 text-white py-4 rounded-full font-semibold text-lg hover:bg-orange-600 transition-colors">
						Let's Begin
					</button>
				</div>
			</div>
		</div>
	);
}

interface ErrorStepProps {
	onClose: () => void;
	onRetry: () => void;
}

export function ErrorStep({ onClose, onRetry }: ErrorStepProps) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="w-full max-w-2xl px-8">
				<div className="bg-white rounded-lg shadow-sm p-12 relative">
					<button
						onClick={onClose}
						className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>

					<div className="flex justify-center mb-8">
						<div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
							<svg
								className="w-12 h-12 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={3}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</div>
					</div>

					<h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
						The verification link is invalid or has expired.
					</h2>
					<p className="text-center text-xl text-gray-600 mb-8">
						Please request a new OTP.
					</p>

					<button
						onClick={onRetry}
						className="w-full max-w-sm mx-auto block bg-orange-500 text-white py-4 rounded-full font-semibold text-lg hover:bg-orange-600 transition-colors">
						Request
					</button>
				</div>
			</div>
		</div>
	);
}
