import { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { userApiClient } from "../api/userApiClient";
import type { ClassLevelData } from "../types/user.types";

interface ClassSelectorProps {
  selectedClasses: string[];
  onClassesChange: (classes: string[]) => void;
  error?: string;
}

export default function ClassSelector({ selectedClasses, onClassesChange, error }: ClassSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [classLevels, setClassLevels] = useState<ClassLevelData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClassLevels = async () => {
      setLoading(true);
      try {
        const levels = await userApiClient.getClassLevels();
        setClassLevels(Array.isArray(levels) ? levels : []);
      } catch (error) {
        console.error("Failed to fetch class levels:", error);
        setClassLevels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClassLevels();
  }, []);

  const handleClassToggle = (classId: string) => {
    if (selectedClasses.includes(classId)) {
      onClassesChange(selectedClasses.filter(id => id !== classId));
    } else {
      onClassesChange([...selectedClasses, classId]);
    }
  };

  const handleRemoveClass = (classId: string) => {
    onClassesChange(selectedClasses.filter(id => id !== classId));
  };

  const getClassName = (classId: string) => {
    return classLevels.find(c => c.id === classId)?.class || classId;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Assigned classes *
      </label>
      
      {/* Selected classes as chips */}
      {selectedClasses.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedClasses.map((classId) => (
            <div
              key={classId}
              className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-lg text-sm"
            >
              <span>{getClassName(classId)}</span>
              <button
                type="button"
                onClick={() => handleRemoveClass(classId)}
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
              {selectedClasses.length > 0 
                ? `${selectedClasses.length} class${selectedClasses.length > 1 ? 'es' : ''} selected`
                : 'Select classes'
              }
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-2 text-sm text-gray-500">Loading classes...</div>
            ) : classLevels.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">No classes found</div>
            ) : (
              classLevels.map((classLevel) => (
                <label
                  key={classLevel.id}
                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(classLevel.id)}
                    onChange={() => handleClassToggle(classLevel.id)}
                    className="mr-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-900">{classLevel.class}</span>
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