import { useState } from "react";
import { Settings, Bell, ChevronDown, Users } from "lucide-react";

interface Child {
	id: string;
	name: string;
	avatar: string;
	class: string;
}

// Mock children data
const mockChildren: Child[] = [
	{ id: "1", name: "Jane Doe", avatar: "👧", class: "JSS1-A" },
	{ id: "2", name: "James Doe", avatar: "👦", class: "JSS2-B" },
	{ id: "3", name: "Grace Doe", avatar: "👧", class: "JSS3-C" },
];

export default function ParentHeader() {
	const [, setSelectedChild] = useState<Child>(mockChildren[0]);
	const [isChildDropdownOpen, setIsChildDropdownOpen] = useState(false);

	const handleChildSelect = (child: Child) => {
		setSelectedChild(child);
		setIsChildDropdownOpen(false);
		// TODO: Update dashboard data based on selected child
		console.log("Selected child:", child.name);
	};

	return (
		<header className="bg-white border-b border-gray-200 px-6 py-4">
			<div className="flex items-center justify-between">
				{/* School Info */}
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">
						L
					</div>
					<div>
						<h2 className="text-sm font-semibold text-gray-900">
							Lakeridge Mountain
						</h2>
						<p className="text-xs text-gray-600">High School</p>
					</div>
				</div>

				{/* Right Section */}
				<div className="flex items-center gap-4">
					{/* Settings */}
					<button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
						<Settings className="w-5 h-5 text-gray-600" />
					</button>

					{/* Notifications */}
					<button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
						<Bell className="w-5 h-5 text-gray-600" />
						<span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
					</button>

					{/* Child Selector Dropdown */}
					<div className="relative">
						<button
							onClick={() => setIsChildDropdownOpen(!isChildDropdownOpen)}
							className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
							<Users className="w-5 h-5 text-gray-600" />
							<span className="text-sm font-medium text-gray-700">
								Select child
							</span>
							<ChevronDown className="w-4 h-4 text-gray-600" />
						</button>

						{/* Dropdown Menu */}
						{isChildDropdownOpen && (
							<>
								{/* Backdrop */}
								<div
									className="fixed inset-0 z-10"
									onClick={() => setIsChildDropdownOpen(false)}
								/>
								{/* Dropdown */}
								<div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
									{mockChildren.map((child) => (
										<button
											key={child.id}
											onClick={() => handleChildSelect(child)}
											className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
											<div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl">
												{child.avatar}
											</div>
											<div className="text-left">
												<p className="text-sm font-medium text-gray-900">
													{child.name}
												</p>
												<p className="text-xs text-gray-600">{child.class}</p>
											</div>
										</button>
									))}
								</div>
							</>
						)}
					</div>

					{/* Parent Profile */}
					<div className="flex items-center gap-3 pl-4 border-l border-gray-200">
						<div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
							P
						</div>
						<div className="text-right">
							<p className="text-sm font-semibold text-gray-900">Paula Doe</p>
							<p className="text-xs text-gray-600">Parent</p>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
