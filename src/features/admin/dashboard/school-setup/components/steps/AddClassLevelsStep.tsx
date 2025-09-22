import React, { useState, useMemo } from "react";
import { useSchoolSetupStore } from "../../store/schoolSetupStore";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ClassCategory {
  id: string;
  title: string;
  expanded: boolean;
}

// Mapping of school types to allowed categories
const schoolTypeToCategories: Record<string, string[]> = {
  "nursery": ["nursery"],
  "primary": ["primary"],
  "secondary": ["junior_secondary", "senior_secondary"],
  "combined": ["primary", "junior_secondary", "senior_secondary"],
  "all": ["nursery", "grade", "primary", "junior_secondary", "senior_secondary"],
};

// All possible categories
const allCategories = [
  { id: "nursery", title: "Nursery Class", expanded: true },
  { id: "grade", title: "Grade Class", expanded: true },
  { id: "primary", title: "Primary Class", expanded: true },
  { id: "junior_secondary", title: "Junior Secondary Levels (JSS)", expanded: true },
  { id: "senior_secondary", title: "Senior Secondary Levels (SSS)", expanded: true },
];

export default function AddClassLevelsStep() {
  const {
    schoolInfo,
    selectedClassLevels,
    toggleClassLevel,
    toggleCategoryLevels,
    nextStep,
    previousStep,
  } = useSchoolSetupStore();

  // Filter categories based on school type
  const allowedCategories = useMemo(() => {
    const schoolType = schoolInfo.schoolType;
    if (!schoolType) {
      // If no school type is selected, show all categories
      return allCategories;
    }
    
    const allowedCategoryIds = schoolTypeToCategories[schoolType] || [];
    return allCategories.filter(category => allowedCategoryIds.includes(category.id));
  }, [schoolInfo.schoolType]);

  const [categories, setCategories] = useState<ClassCategory[]>(allowedCategories);

  // Update categories when school type changes
  React.useEffect(() => {
    setCategories(allowedCategories.map(cat => ({
      ...cat,
      expanded: true, // Keep expanded by default
    })));
  }, [allowedCategories]);

  // Filter class levels to only show ones from allowed categories
  const filteredClassLevels = useMemo(() => {
    const allowedCategoryIds = allowedCategories.map(cat => cat.id);
    return selectedClassLevels.filter(level => 
      allowedCategoryIds.includes(level.category)
    );
  }, [selectedClassLevels, allowedCategories]);

  // Toggle dropdown expansion
  const toggleCategoryExpansion = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
      )
    );
  };

  // Get levels for a category (from filtered levels only)
  const getCategoryLevels = (categoryId: string) =>
    filteredClassLevels.filter((level) => level.category === categoryId);

  const isCategorySelected = (categoryId: string) => {
    const levels = getCategoryLevels(categoryId);
    return levels.length > 0 && levels.every((level) => level.selected);
  };

  const isCategoryPartiallySelected = (categoryId: string) => {
    const levels = getCategoryLevels(categoryId);
    const selectedCount = levels.filter((level) => level.selected).length;
    return selectedCount > 0 && selectedCount < levels.length;
  };

  const hasSelectedLevels = filteredClassLevels.some((level) => level.selected);

  // Handle category checkbox toggle
  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    toggleCategoryLevels(categoryId, checked);
  };

  // Handle next step
  const handleNext = () => {
    if (hasSelectedLevels) {
      nextStep();
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Add Class Levels</h2>
        <div className="mb-8">
          <p className="text-gray-600">Select the class levels available in your school</p>
          {schoolInfo.schoolType && (
            <div className="mt-2 p-3 bg-orange-50 border-l-4 border-orange-500 rounded-r">
              <p className="text-sm text-orange-800">
                <span className="font-medium">School Type:</span> {
                  schoolInfo.schoolType === "nursery" ? "Nursery/Pre-School" :
                  schoolInfo.schoolType === "primary" ? "Primary School" :
                  schoolInfo.schoolType === "secondary" ? "Secondary School" :
                  schoolInfo.schoolType === "combined" ? "Primary & Secondary" :
                  schoolInfo.schoolType === "all" ? "All Levels" :
                  schoolInfo.schoolType
                }
              </p>
              <p className="text-xs text-orange-600 mt-1">
                Only class levels relevant to your school type are shown below.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {categories.map((category) => {
            const isSelected = isCategorySelected(category.id);
            const isPartiallySelected = isCategoryPartiallySelected(category.id);
            const levels = getCategoryLevels(category.id);

            return (
              <div key={category.id} className="border rounded-md">
                {/* Category Header */}
                <div className="flex justify-between items-center p-4 cursor-pointer bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleCategoryToggle(category.id, e.target.checked)}
                      ref={(el) => {
                        if (el) el.indeterminate = isPartiallySelected;
                      }}
                      className="h-5 w-5 text-orange-500 border-gray-300 rounded"
                    />
                    <span className="font-medium">{category.title}</span>
                  </div>
                  <button
                    onClick={() => toggleCategoryExpansion(category.id)}
                    type="button"
                    className="text-gray-500"
                  >
                    {category.expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                {/* Category Levels */}
                {category.expanded && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 px-4 py-3">
                    {levels.map((level) => (
                      <label key={level.id} className="inline-flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={level.selected}
                          onChange={() => toggleClassLevel(level.id)}
                          className="h-4 w-4 text-orange-500 border-gray-300 rounded"
                        />
                        <span>{level.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={previousStep}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!hasSelectedLevels}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            hasSelectedLevels 
              ? "bg-orange-500 text-white hover:bg-orange-600" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
