import { useState } from 'react';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';
import { schoolSetupApiClient } from '../../dashboard/api/schoolSetupApiClient';
import type { CreateClassesRequest } from '../../dashboard/types/dashboard-api.types';

interface ClassData {
  id: string;
  levelName: string;
  className: string;
  arms: string[];
}

interface QuickClassCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Predefined level options for quick selection
const LEVEL_OPTIONS = [
  { value: 'Nursery Class', label: 'Nursery' },
  { value: 'Primary Class', label: 'Primary' },
  { value: 'Junior Secondary levels', label: 'Junior Secondary' },
  { value: 'Senior Secondary levels', label: 'Senior Secondary' },
];

// Common arm options
const ARM_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function QuickClassCreationModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: QuickClassCreationModalProps) {
  const [classes, setClasses] = useState<ClassData[]>([{
    id: '1',
    levelName: 'Primary Class',
    className: 'Primary 1',
    arms: ['A']
  }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add new class
  const addNewClass = () => {
    const newClass: ClassData = {
      id: Date.now().toString(),
      levelName: 'Primary Class',
      className: 'Primary 1',
      arms: ['A']
    };
    setClasses([...classes, newClass]);
  };

  // Remove class
  const removeClass = (id: string) => {
    if (classes.length > 1) {
      setClasses(classes.filter(c => c.id !== id));
    }
  };

  // Update class field
  const updateClass = (id: string, field: keyof ClassData, value: any) => {
    setClasses(classes.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  // Toggle arm selection
  const toggleArm = (classId: string, arm: string) => {
    setClasses(classes.map(c => {
      if (c.id === classId) {
        const newArms = c.arms.includes(arm)
          ? c.arms.filter(a => a !== arm)
          : [...c.arms, arm];
        return { ...c, arms: newArms };
      }
      return c;
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate data
      const validClasses = classes.filter(c => 
        c.className.trim() && c.arms.length > 0
      );

      if (validClasses.length === 0) {
        throw new Error('Please add at least one class with arms');
      }

      // Prepare API request
      const requestData: CreateClassesRequest = {
        classes: validClasses.map(c => ({
          levelName: c.levelName,
          class: c.className.trim(),
          arms: c.arms
        }))
      };

      console.log('🚀 [QuickClassCreation] Creating classes:', requestData);

      // Call API
      const response = await schoolSetupApiClient.createMultipleClasses(requestData);

      console.log('✅ [QuickClassCreation] Classes created successfully:', response);

      // Reset form and close
      setClasses([{
        id: '1',
        levelName: 'Primary Class',
        className: 'Primary 1',
        arms: ['A']
      }]);
      
      onSuccess();
      onClose();

    } catch (err) {
      console.error('❌ [QuickClassCreation] Failed to create classes:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create classes';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Quick Class Creation</h2>
          <button 
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Classes List */}
          <div className="space-y-6">
            {classes.map((classData, index) => (
              <div key={classData.id} className="border border-gray-200 rounded-lg p-4">
                {/* Class Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Class {index + 1}</h3>
                  {classes.length > 1 && (
                    <button
                      onClick={() => removeClass(classData.id)}
                      disabled={isSubmitting}
                      className="p-1 text-red-500 hover:bg-red-50 rounded disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Level Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level Type
                    </label>
                    <select
                      value={classData.levelName}
                      onChange={(e) => updateClass(classData.id, 'levelName', e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
                    >
                      {LEVEL_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class Name
                    </label>
                    <input
                      type="text"
                      value={classData.className}
                      onChange={(e) => updateClass(classData.id, 'className', e.target.value)}
                      disabled={isSubmitting}
                      placeholder="e.g., Primary 1, JSS 1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Arms Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Arms
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ARM_OPTIONS.map(arm => (
                      <button
                        key={arm}
                        onClick={() => toggleArm(classData.id, arm)}
                        disabled={isSubmitting}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                          classData.arms.includes(arm)
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {arm}
                      </button>
                    ))}
                  </div>
                  {classData.arms.length === 0 && (
                    <p className="text-red-500 text-xs mt-1">Select at least one arm</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Class Button */}
          <button
            onClick={addNewClass}
            disabled={isSubmitting}
            className="mt-4 flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add Another Class
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || classes.every(c => !c.className.trim() || c.arms.length === 0)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Classes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}