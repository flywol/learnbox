import { Bell, Settings } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function Header() {
	const { user } = useAuthStore();

	return (
		<header className="bg-white border-b border-gray-200 px-8 py-4">
			<div className="flex items-center justify-end gap-4">
				<button className="p-2 hover:bg-gray-100 rounded-lg">
					<Settings className="w-5 h-5 text-gray-600" />
				</button>
				<button className="p-2 hover:bg-gray-100 rounded-lg">
					<Bell className="w-5 h-5 text-gray-600" />
				</button>
				<div className="flex items-center gap-3 ml-4">
					<div className="text-right">
						<p className="text-sm font-medium text-gray-900">
							{user?.fullName}
						</p>
						<p className="text-xs text-gray-500 capitalize">
							{user?.role?.toLowerCase()}
						</p>
					</div>
					<div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
						<span className="text-orange-600 font-semibold">
							{user?.fullName?.charAt(0).toUpperCase()}
						</span>
					</div>
				</div>
			</div>
		</header>
	);
}
