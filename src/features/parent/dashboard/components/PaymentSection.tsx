import { useNavigate } from "react-router-dom";

export default function PaymentSection() {
	const navigate = useNavigate();

	const paymentOptions = [
		{
			id: "generate",
			label: "Generate Payment",
			path: "/parent/payments?tab=generate",
		},
		{
			id: "pay",
			label: "Pay Now",
			path: "/parent/payments?tab=pay",
		},
		{
			id: "receipt",
			label: "Print Receipt",
			path: "/parent/payments?tab=receipt",
		},
	];

	return (
		<div className="bg-white rounded-lg p-6 border border-gray-200">
			<h2 className="text-lg font-semibold text-gray-900 mb-4">
				Pay School Fees
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{paymentOptions.map((option) => {
					return (
						<button
							key={option.id}
							onClick={() => navigate(option.path)}
							className="flex flex-col items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all group">
							{/* Payment SVG Icon */}
							<div className="w-20 h-20 flex items-center justify-center">
								<img
									src="/assets/payment.svg"
									alt="Payment"
									className="w-full h-full object-contain"
								/>
							</div>

							{/* Label */}
							<span className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
								{option.label}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
