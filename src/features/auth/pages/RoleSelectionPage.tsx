import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Role } from "../types/auth.types";

const roleConfig = {
	STUDENT: {
		label: "I'm a student",
		image: "/images/onboarding/student-role.svg",
	},
	PARENT: {
		label: "I'm a parent",
		image: "/images/onboarding/parent-role.svg",
	},
	TEACHER: {
		label: "I'm a teacher",
		image: "/images/onboarding/teacher-role.svg",
	},
	ADMIN: {
		label: "I'm an admin",
		image: "/images/onboarding/admin-role.svg",
	},
};

const availableRoles: Role[] = ["STUDENT", "PARENT", "TEACHER", "ADMIN"];

const RoleSelectionPage = () => {
	const [selectedRole, setSelectedRoleLocal] = useState<Role | null>(null);
	const { setRole } = useAuthStore();
	const navigate = useNavigate();

	const handleSelectRole = (role: Role) => {
		setSelectedRoleLocal(role);
	};

	const handleSubmit = () => {
		if (selectedRole) {
			setRole(selectedRole);
			navigate("/school-setup");
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="w-full max-w-3xl px-8 py-12">
				<div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-16 py-12">
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold text-gray-900">
							What's your role?
						</h1>
						<p className="mt-3 text-lg text-gray-600">
							Select the role that best describes you.
						</p>
					</div>

					<div className="grid grid-cols-2 gap-6 mb-12">
						{availableRoles.map((role) => (
							<button
								key={role}
								onClick={() => handleSelectRole(role)}
								className={`relative p-8 rounded-xl border-2 transition-all duration-200 ${
									selectedRole === role
										? "border-orange-500 bg-orange-50"
										: "border-gray-200 hover:border-gray-300 bg-white"
								}`}>
								{selectedRole === role && (
									<div className="absolute top-4 right-4 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
										<svg
											className="w-4 h-4 text-white"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path d="M5 13l4 4L19 7"></path>
										</svg>
									</div>
								)}

								<div className="flex flex-col items-center">
									<div className="w-32 h-32 mb-4 flex items-center justify-center">
										<img
											src={roleConfig[role]?.image || roleConfig.TEACHER.image}
											alt={`${role} illustration`}
											className="w-full h-full object-contain"
										/>
									</div>
									<span className="text-lg font-medium text-gray-900">
										{roleConfig[role]?.label || `I'm a ${role.toLowerCase()}`}
									</span>
								</div>
							</button>
						))}
					</div>

					<div className="flex justify-center">
						<button
							onClick={handleSubmit}
							disabled={!selectedRole}
							className={`px-24 py-4 rounded-full font-semibold text-lg transition-all duration-200 ${
								selectedRole
									? "bg-orange-500 text-white hover:bg-orange-600"
									: "bg-gray-200 text-gray-400 cursor-not-allowed"
							}`}>
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RoleSelectionPage;
