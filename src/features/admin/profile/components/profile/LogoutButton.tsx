import { ChevronRight } from "lucide-react";

interface LogoutButtonProps {
  onLogout: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <div className="pt-4">
      <button
        onClick={onLogout}
        className="flex items-center justify-between w-48 px-6 py-3 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
      >
        <span>Logout</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}