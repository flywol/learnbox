import { useState } from "react";
import { ChevronLeft, ChevronDown, CreditCard, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentsPage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<
		"generate" | "pay" | "receipt"
	>("generate");

	const tabs = [
		{ id: "generate" as const, label: "Generate fee" },
		{ id: "pay" as const, label: "Pay fees" },
		{ id: "receipt" as const, label: "Print receipt" },
	];

	return (
		<div>
			{/* Header */}
			<div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
				<button
					onClick={() => navigate(-1)}
					className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors">
					<ChevronLeft className="w-5 h-5 text-gray-700" />
				</button>
				<h1 className="text-base md:text-xl font-semibold text-gray-900">School Payments</h1>
			</div>

			{/* Tabs */}
			<div className="flex gap-1 mb-4 md:mb-6 overflow-x-auto">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`px-3 md:px-6 py-2 text-xs md:text-base font-medium transition-colors whitespace-nowrap ${
							activeTab === tab.id
								? "text-gray-900 border-b-2 border-orange-500"
								: "text-gray-600 border-b-2 border-transparent hover:text-gray-900"
						}`}>
						{tab.label}
					</button>
				))}
			</div>

			{/* Generate Fee Tab */}
			{activeTab === "generate" && (
				<div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 ">
					<div className="space-y-4">
						{/* Full Name */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Full Name
							</label>
							<div className="relative">
								<select className="w-full px-3 py-2 border border-gray-200 rounded-lg appearance-none bg-white">
									<option>Select child</option>
									<option>Jane Doe</option>
									<option>James Doe</option>
									<option>Grace Doe</option>
								</select>
								<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
							</div>
						</div>

						{/* Class */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Class
							</label>
							<input
								type="text"
								value="JSS 3"
								readOnly
								className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
							/>
						</div>

						{/* Session */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Session
							</label>
							<input
								type="text"
								value="2023/2024"
								readOnly
								className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
							/>
						</div>

						{/* Term */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Term
							</label>
							<input
								type="text"
								value="1st term"
								readOnly
								className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
							/>
						</div>

						{/* Generate Button */}
						<button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
							Generate
						</button>
					</div>
				</div>
			)}

			{/* Pay Fees Tab */}
			{activeTab === "pay" && (
				<div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 ">
					{/* Wallet Icon */}
					<div className="flex justify-center mb-6">
						<div className="w-32 h-24 bg-gradient-to-br from-orange-800 to-orange-900 rounded-lg flex items-center justify-center relative">
							<Wallet className="w-12 h-12 text-white" />
							<span className="absolute bottom-2 text-white text-xs font-medium">
								Tuition
							</span>
						</div>
					</div>

					<div className="space-y-4">
						{/* Full Name */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Full Name
							</label>
							<div className="relative">
								<select className="w-full px-3 py-2 border border-gray-200 rounded-lg appearance-none bg-white">
									<option>Select child</option>
									<option selected>Jason</option>
								</select>
								<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
							</div>
						</div>

						{/* Class */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Class
							</label>
							<input
								type="text"
								value="JSS 3"
								readOnly
								className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
							/>
						</div>

						{/* Session & Term Row */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Session
								</label>
								<input
									type="text"
									value="2023/2024"
									readOnly
									className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Term
								</label>
								<input
									type="text"
									value="1st term"
									readOnly
									className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
								/>
							</div>
						</div>

						{/* Tuition Fee */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Tuition Fee
							</label>
							<input
								type="text"
								value="₦300,000.00"
								readOnly
								className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 font-semibold"
							/>
						</div>

						{/* Payment Method */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Payment Method
							</label>
							<div className="flex gap-3">
								<div className="w-12 h-12 bg-orange-800 rounded-lg flex items-center justify-center">
									<CreditCard className="w-6 h-6 text-white" />
								</div>
								<div className="w-12 h-12 bg-orange-700 rounded-lg flex items-center justify-center">
									<Wallet className="w-6 h-6 text-white" />
								</div>
								<div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
									<span className="text-white font-bold">$</span>
								</div>
								<div className="w-12 h-12 bg-orange-800 rounded-lg flex items-center justify-center">
									<span className="text-white font-bold">₿</span>
								</div>
							</div>
						</div>

						{/* Payment Summary */}
						<div className="pt-4 border-t border-gray-200">
							<h3 className="text-sm font-semibold text-gray-900 mb-3">
								Payment summary
							</h3>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-gray-600">Tuition</span>
									<span className="text-gray-900 font-medium">
										₦300,000.00
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Service charge</span>
									<span className="text-gray-900 font-medium">₦100.00</span>
								</div>
								<div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200">
									<span className="text-gray-900">Total tuition</span>
									<span className="text-gray-900">₦300,100.00</span>
								</div>
							</div>
						</div>

						{/* Make Payment Button */}
						<button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors mt-4">
							Make Payment
						</button>
					</div>
				</div>
			)}

			{/* Print Receipt Tab */}
			{activeTab === "receipt" && (
				<div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 ">
					{/* Wallet Icon */}
					<div className="flex justify-center mb-4 md:mb-6">
						<div className="w-28 h-20 md:w-32 md:h-24 bg-gradient-to-br from-orange-800 to-orange-900 rounded-lg flex items-center justify-center relative">
							<Wallet className="w-10 h-10 md:w-12 md:h-12 text-white" />
							<span className="absolute bottom-2 text-white text-xs font-medium">
								Tuition
							</span>
						</div>
					</div>

					<p className="text-center text-gray-600 text-xs md:text-sm">
						Receipt will be generated after successful payment
					</p>
				</div>
			)}
		</div>
	);
}
