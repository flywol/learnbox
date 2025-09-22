import CustomArmModal from "../CustomArmModal";
import ClassArmsHeader from "../class-arms/ClassArmsHeader";
import ClassArmCard from "../class-arms/ClassArmCard";
import ClassArmsActions from "../class-arms/ClassArmsActions";
import { useClassArmsLogic } from "../class-arms/useClassArmsLogic";

interface ClassArmsProps {
  onComplete?: () => void;
}

export default function AddClassArmsStep({ onComplete }: ClassArmsProps) {
  const {
    activeClassLevels,
    showCustomModal,
    setShowCustomModal,
    isCompleting,
    apiError,
    handleArmToggle,
    handleDeleteArm,
    handleComplete,
    getClassArms,
    previousStep,
    deleteAllArmsForClass,
    addCustomArmToAllClasses,
  } = useClassArmsLogic(onComplete);

  const handleCustomArmClick = () => {
    setShowCustomModal(true);
  };

  const handleCustomArmAdd = (armNames: string[]) => {
    addCustomArmToAllClasses(armNames);
    setShowCustomModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <ClassArmsHeader apiError={apiError} />

        <div className="space-y-6">
          {activeClassLevels.map((level) => {
            const { defaultArms, selectedArms, customArms } = getClassArms(level.id);
            const isFirstClass = level.id === activeClassLevels[0]?.id;

            return (
              <ClassArmCard
                key={level.id}
                level={level}
                isFirstClass={isFirstClass}
                defaultArms={defaultArms}
                selectedArms={selectedArms}
                customArms={customArms}
                onArmToggle={(arm) => handleArmToggle(level.id, arm)}
                onDeleteArm={(arm) => handleDeleteArm(level.id, arm)}
                onDeleteAllArms={() => deleteAllArmsForClass(level.id)}
                onCustomArmClick={handleCustomArmClick}
                isCompleting={isCompleting}
              />
            );
          })}
        </div>

        <ClassArmsActions
          onPreviousStep={previousStep}
          onComplete={handleComplete}
          isCompleting={isCompleting}
        />
      </div>

      {showCustomModal && (
        <CustomArmModal
          isOpen={showCustomModal}
          onClose={() => setShowCustomModal(false)}
          onSubmit={handleCustomArmAdd}
          className=""
        />
      )}
    </div>
  );
}