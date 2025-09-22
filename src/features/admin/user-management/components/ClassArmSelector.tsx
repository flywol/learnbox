import { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { userApiClient } from "../api/userApiClient";
import type { ClassLevelData } from "../types/user.types";

interface ClassArmData {
  id: string;
  name: string;
  armName: string;
  classLevel: string;
  classLevelId: string;
}

interface ClassArmSelectorProps {
  selectedClassArms: string[];
  onClassArmsChange: (classArms: string[]) => void;
  selectedClasses: string[];
  error?: string;
}

export default function ClassArmSelector({ selectedClassArms, onClassArmsChange, selectedClasses, error }: ClassArmSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [classArms, setClassArms] = useState<ClassArmData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClassArms = async () => {
      setLoading(true);
      try {
        const classLevels = await userApiClient.getClassLevels();
        
        // Extract arms from selected classes only
        const filteredArms: ClassArmData[] = [];
        
        classLevels.forEach((level: ClassLevelData) => {
          // Only include arms from selected classes
          if (selectedClasses.includes(level.id) && level.arms && Array.isArray(level.arms)) {
            level.arms.forEach((arm: any) => {
              filteredArms.push({
                id: arm.id,
                name: arm.name || arm.armName,
                armName: arm.armName,
                classLevel: level.levelName,
                classLevelId: level.id
              });
            });
          }
        });
        
        setClassArms(filteredArms);
      } catch (error) {
        console.error("Failed to fetch class arms:", error);
        setClassArms([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if classes are selected
    if (selectedClasses.length > 0) {
      fetchClassArms();
    } else {
      setClassArms([]);
    }
  }, [selectedClasses]);

  const handleClassArmToggle = (classArmId: string) => {
    if (selectedClassArms.includes(classArmId)) {
      onClassArmsChange(selectedClassArms.filter(id => id !== classArmId));
    } else {
      onClassArmsChange([...selectedClassArms, classArmId]);
    }
  };

  const handleRemoveClassArm = (classArmId: string) => {
    onClassArmsChange(selectedClassArms.filter(id => id !== classArmId));
  };

  const getClassArmName = (classArmId: string) => {
    const arm = classArms.find(arm => arm.id === classArmId);
    return arm ? `${arm.classLevel} ${arm.armName}` : classArmId;
  };

  // If no classes are selected, show a message
  if (selectedClasses.length === 0) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Assigned class arms *
        </label>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">Please select classes first to view available class arms.</p>
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  // If no class arms from selected classes, show text input for manual entry
  if (!loading && classArms.length === 0) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Assigned class arms *
        </label>
        
        {/* Selected class arms as chips */}
        {selectedClassArms.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedClassArms.map((armName, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-lg text-sm"
              >
                <span>{armName}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveClassArm(armName)}
                  className="text-orange-600 hover:text-orange-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type class arm and press Enter"
            className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const value = e.currentTarget.value.trim();
                if (value && !selectedClassArms.includes(value)) {
                  onClassArmsChange([...selectedClassArms, value]);
                  e.currentTarget.value = '';
                }
              }
            }}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Assigned class arms *
      </label>
      
      {/* Selected class arms as chips */}
      {selectedClassArms.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedClassArms.map((classArmId) => (
            <div
              key={classArmId}
              className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-lg text-sm"
            >
              <span>{getClassArmName(classArmId)}</span>
              <button
                type="button"
                onClick={() => handleRemoveClassArm(classArmId)}
                className="text-orange-600 hover:text-orange-800"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-2 text-left border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-500">
              {loading ? 'Loading class arms...' : selectedClassArms.length > 0 
                ? `${selectedClassArms.length} class arm${selectedClassArms.length > 1 ? 's' : ''} selected`
                : 'Select class arms'
              }
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-2 text-sm text-gray-500">Loading class arms...</div>
            ) : classArms.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">No class arms found</div>
            ) : (
              classArms.map((classArm) => (
                <label
                  key={classArm.id}
                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedClassArms.includes(classArm.id)}
                    onChange={() => handleClassArmToggle(classArm.id)}
                    className="mr-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-900">{classArm.classLevel} {classArm.armName}</span>
                </label>
              ))
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}