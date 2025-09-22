import { Trash2 } from "lucide-react";

interface ArmToggleButtonProps {
  arm: string;
  isSelected: boolean;
  onToggle: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

export default function ArmToggleButton({ 
  arm, 
  isSelected, 
  onToggle, 
  onDelete, 
  disabled = false 
}: ArmToggleButtonProps) {
  return (
    <label
      className={`
        relative flex items-center px-4 py-2 rounded-lg border cursor-pointer transition-colors
        ${isSelected
          ? "bg-orange-50 border-orange-500 text-orange-700"
          : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
        }
      `}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="sr-only"
        disabled={disabled}
      />
      <span className="font-medium">{arm}</span>
      <button
        onClick={(e) => {
          e.preventDefault();
          onDelete();
        }}
        className="ml-2 text-red-500 hover:text-red-700"
        disabled={disabled}
        type="button"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </label>
  );
}