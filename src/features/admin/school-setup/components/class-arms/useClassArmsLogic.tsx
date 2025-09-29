import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSchoolSetupStore } from "../../store/schoolSetupStore";
import schoolSetupApiClient from "@/features/admin/dashboard/api/schoolSetupApiClient";

export function useClassArmsLogic(onComplete?: () => void) {
  const navigate = useNavigate();
  const {
    selectedClassLevels,
    classArms,
    updateClassArms,
    updateClassArmsWithTemplate,
    addCustomArmToAllClasses,
    removeCustomArm,
    removeCustomArmWithTemplate,
    deleteDefaultArm,
    deleteDefaultArmWithTemplate,
    deleteAllArmsForClass,
    previousStep,
    markAsCompleted,
    clearStorageAfterCompletion,
  } = useSchoolSetupStore();

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [editingArms, setEditingArms] = useState<{ [key: string]: string[] }>({});
  const [isCompleting, setIsCompleting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const activeClassLevels = selectedClassLevels.filter((level) => level.selected);

  const getDefaultArms = (classId: string) => {
    if (classId.includes("sss")) {
      return ["Science", "Commercial", "Humanities"];
    }
    return ["A", "B", "C", "D"];
  };

  const handleArmToggle = (classId: string, arm: string) => {
    const currentArms =
      editingArms[classId] ||
      classArms.find((ca) => ca.classId === classId)?.arms ||
      [];
    const newArms = currentArms.includes(arm)
      ? currentArms.filter((a) => a !== arm)
      : [...currentArms, arm];

    const isFirstClass = classId === activeClassLevels[0]?.id;
    
    setEditingArms((prev) => ({ ...prev, [classId]: newArms }));
    
    if (isFirstClass) {
      updateClassArmsWithTemplate(classId, newArms, true);
      const newEditingArms: { [key: string]: string[] } = {};
      activeClassLevels.forEach((level) => {
        newEditingArms[level.id] = [...newArms];
      });
      setEditingArms((prev) => ({ ...prev, ...newEditingArms }));
    } else {
      updateClassArms(classId, newArms);
    }
  };

  const handleCustomArmAdd = (armName: string) => {
    // Add custom arm to all classes (this already auto-selects it)
    addCustomArmToAllClasses([armName]);
    
    // Update editing arms to reflect the change
    const newEditingArms: { [key: string]: string[] } = {};
    activeClassLevels.forEach((level) => {
      const currentArms = editingArms[level.id] || 
        classArms.find((ca) => ca.classId === level.id)?.arms || [];
      // Only add if not already present
      if (!currentArms.includes(armName)) {
        newEditingArms[level.id] = [...currentArms, armName];
      } else {
        newEditingArms[level.id] = currentArms;
      }
    });
    setEditingArms((prev) => ({ ...prev, ...newEditingArms }));
  };

  const handleDeleteArm = (classId: string, arm: string) => {
    const isFirstClass = classId === activeClassLevels[0]?.id;
    
    if (getDefaultArms(classId).includes(arm)) {
      if (isFirstClass) {
        deleteDefaultArmWithTemplate(classId, arm, true);
      } else {
        deleteDefaultArm(classId, arm);
      }
    } else {
      if (isFirstClass) {
        removeCustomArmWithTemplate(classId, arm, true);
      } else {
        removeCustomArm(classId, arm);
      }
    }

    setEditingArms((prev) => ({
      ...prev,
      [classId]: (prev[classId] || []).filter((a) => a !== arm),
    }));
  };

  const validateClassArms = () => {
    return activeClassLevels.every((level) => {
      const classArmData = classArms.find((ca) => ca.classId === level.id);
      const arms = classArmData?.arms || [];
      return arms.length > 0;
    });
  };

  const handleComplete = async () => {
    if (!validateClassArms()) {
      setApiError("Please select at least one arm for each class");
      return;
    }

    setIsCompleting(true);
    setApiError(null);

    try {
      await schoolSetupApiClient.createClasses(selectedClassLevels, classArms);
      markAsCompleted();
      clearStorageAfterCompletion();
      navigate("/admin/dashboard");
      if (onComplete) {
        onComplete();
      }
    } catch (error: unknown) {
      setApiError(
        error instanceof Error ? error.message : "Failed to create classes. Please try again."
      );
    } finally {
      setIsCompleting(false);
    }
  };

  const getClassArms = (classId: string) => {
    const classArm = classArms.find((ca) => ca.classId === classId);
    const deletedDefaultArms = classArm?.deletedDefaultArms || [];
    const availableDefaultArms = getDefaultArms(classId).filter(
      (arm) => !deletedDefaultArms.includes(arm)
    );
    
    return {
      defaultArms: availableDefaultArms,
      selectedArms: editingArms[classId] || classArm?.arms || [],
      customArms: classArm?.customArms || [],
    };
  };

  return {
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
    handleCustomArmAdd,
  };
}