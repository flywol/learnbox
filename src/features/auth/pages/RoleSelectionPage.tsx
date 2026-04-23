import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Role } from "../types/auth.types";

const roleConfig: Record<Role, { label: string; image: string }> = {
	STUDENT: { label: "I'm a student", image: "/images/onboarding/student-role.svg" },
	PARENT:  { label: "I'm a parent",  image: "/images/onboarding/parent-role.svg"  },
	TEACHER: { label: "I'm a teacher", image: "/images/onboarding/teacher-role.svg" },
	ADMIN:   { label: "I'm an admin",  image: "/images/onboarding/admin-role.svg"   },
};

const availableRoles: Role[] = ["STUDENT", "PARENT", "TEACHER", "ADMIN"];

export default function RoleSelectionPage() {
	const [selectedRole, setSelectedRoleLocal] = useState<Role | null>(null);
	const { setRole } = useAuthStore();
	const navigate = useNavigate();

	const handleSubmit = () => {
		if (!selectedRole) return;
		setRole(selectedRole);
		if (selectedRole === "TEACHER") {
			navigate("/onboarding");
		} else {
			navigate("/school-setup");
		}
	};

	return (
		<div className="min-h-screen bg-white flex items-center justify-center px-4">
			<div className="border border-[#e6e6e6] rounded-2xl p-16 flex flex-col items-center gap-12 w-full max-w-4xl">
				{/* Header */}
				<div className="flex flex-col items-center gap-4 text-center text-[#2b2b2b]">
					<h1 className="text-5xl font-bold leading-[1.4]">What's your role?</h1>
					<p className="text-xl text-[#2b2b2b]">Select the role that best describes you.</p>
				</div>

				{/* Role Cards */}
				<div className="flex flex-col gap-8">
					<div className="flex gap-8 flex-wrap justify-center">
						{availableRoles.map((role) => (
							<button
								key={role}
								onClick={() => setSelectedRoleLocal(role)}
								className={`relative w-[360px] h-[220px] border rounded-2xl overflow-hidden transition-all duration-200 flex flex-col items-center justify-center gap-4 ${
									selectedRole === role
										? "border-[#fd5d26] bg-orange-50"
										: "border-[#969696] bg-white hover:border-[#fd5d26]/60"
								}`}
							>
								{selectedRole === role && (
									<div className="absolute top-4 right-4 w-6 h-6 bg-[#fd5d26] rounded-full flex items-center justify-center">
										<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
										</svg>
									</div>
								)}
								<img
									src={roleConfig[role].image}
									alt={roleConfig[role].label}
									className="w-[140px] h-[120px] object-contain"
								/>
								<span className="text-xl font-semibold text-[#2b2b2b]">
									{roleConfig[role].label}
								</span>
							</button>
						))}
					</div>
				</div>

				{/* Continue Button */}
				<button
					onClick={handleSubmit}
					disabled={!selectedRole}
					className={`w-[400px] py-[17px] rounded-2xl font-semibold text-xl transition-all duration-200 ${
						selectedRole
							? "bg-[#fd5d26] text-white hover:bg-[#e84d17]"
							: "bg-gray-200 text-gray-400 cursor-not-allowed"
					}`}
				>
					Continue
				</button>
			</div>
		</div>
	);
}
