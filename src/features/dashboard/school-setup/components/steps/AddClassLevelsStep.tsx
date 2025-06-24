import { useState } from "react";
import { useSchoolSetupStore } from "../../store/schoolSetupStore";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ClassCategory {
  id: string;
  title: string;
  expanded: boolean;
}

export default function AddClassLevelsStep() {
  const {
    selectedClassLevels,
    toggleClassLevel,
    toggleCategoryLevels,
    nextStep,
    previousStep,
  } = useSchoolSetupStore();

  const [categories, setCategories] = useState<ClassCategory[]>([
    { id: "nursery", title: "Nursery Class", expanded: true },
    { id: "grade", title: "Grade Class", expanded: true },
    { id: "primary", title: "Primary Class", expanded: true },
    { id: "junior_secondary", title: "Junior Secondary Levels (JSS)", expanded: true },
    { id: "senior_secondary", title: "Senior Secondary Levels (SSS)", expanded: true },
  ]);

  // Toggle dropdown expansion
  const toggleCategoryExpansion = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
      )
    );
  };

  // Get levels for a category
  const getCategoryLevels = (categoryId: string) =>
    selectedClassLevels.filter((level) => level.category === categoryId);

  const isCategorySelected = (categoryId: string) => {
    const levels = getCategoryLevels(categoryId);
    return levels.length > 0 && levels.every((level) => level.selected);
  };

  const isCategoryPartiallySelected = (categoryId: string) => {
    const levels = getCategoryLevels(categoryId);
    const selectedCount = levels.filter((level) => level.selected).length;
    return selectedCount > 0 && selectedCount < levels.length;
  };

  const hasSelectedLevels = selectedClassLevels.some((level) => level.selected);

  // Handle category checkbox toggle
  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    toggleCategoryLevels(categoryId, checked);
  };

  // Handle step continue
  const handleContinue = () => {
    if (hasSelectedLevels) {
      nextStep();
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Add Class Levels</h2>
        <p className="text-gray-600 mb-8">Select the class levels available in your school</p>

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
        <div className="space-x-2">
          <button
            onClick={handleContinue}
            disabled={!hasSelectedLevels}
            className={`px-4 py-2 rounded-md ${
              hasSelectedLevels ? "bg-orange-500 text-white" : "bg-gray-300 text-white"
            }`}
          >
            Save & create class arms
          </button>
          <button
            onClick={handleContinue}
            disabled={!hasSelectedLevels}
            className={`px-4 py-2 rounded-md ${
              hasSelectedLevels ? "bg-orange-600 text-white" : "bg-gray-300 text-white"
            }`}
          >
            Create class
          </button>
        </div>
      </div>
    </div>
  );
}
