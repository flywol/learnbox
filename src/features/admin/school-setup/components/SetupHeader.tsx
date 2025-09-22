import { useNavigate } from "react-router-dom";

export default function SetupHeader() {
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-lg font-medium">School Setup</span>
      </button>
    </div>
  );
}