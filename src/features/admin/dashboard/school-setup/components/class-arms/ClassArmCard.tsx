import ArmToggleButton from "./ArmToggleButton";

interface ClassLevel {
  id: string;
  name: string;
}

interface ClassArmCardProps {
  level: ClassLevel;
  isFirstClass: boolean;
  defaultArms: string[];
  selectedArms: string[];
  customArms: string[];
  onArmToggle: (arm: string) => void;
  onDeleteArm: (arm: string) => void;
  onDeleteAllArms: () => void;
  onCustomArmClick: () => void;
  isCompleting: boolean;
}

export default function ClassArmCard({
  level,
  isFirstClass,
  defaultArms,
  selectedArms,
  customArms,
  onArmToggle,
  onDeleteArm,
  onDeleteAllArms,
  onCustomArmClick,
  isCompleting
}: ClassArmCardProps) {
  const allArms = [...defaultArms, ...customArms];

  return (
    <div className={`border rounded-lg p-4 ${isFirstClass ? 'border-orange-300 bg-orange-50' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">{level.name}</h3>
          {isFirstClass && (
            <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
              Template
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onDeleteAllArms}
          className="text-sm text-red-600 hover:text-red-800 transition-colors"
          disabled={isCompleting}
        >
          Delete All
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {allArms.map((arm) => {
          const isSelected = selectedArms.includes(arm);

          return (
            <ArmToggleButton
              key={arm}
              arm={arm}
              isSelected={isSelected}
              onToggle={() => onArmToggle(arm)}
              onDelete={() => onDeleteArm(arm)}
              disabled={isCompleting}
            />
          );
        })}

        <button
          type="button"
          onClick={onCustomArmClick}
          className="flex items-center gap-2 px-4 py-2 text-orange-500 hover:text-orange-600"
          disabled={isCompleting}
        >
          <span className="text-sm">+ Customize your class arms</span>
        </button>
      </div>
    </div>
  );
}