import { useState } from 'react';
import { ArrowLeft, Plus, Minus, Loader2 } from 'lucide-react';
import { subjectsApiClient } from '../../user-management/api/subjectsApiClient';
import FailureModal from '../../../../common/components/FailureModal';

interface Subject {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
}

interface AddSubjectViewProps {
  classId: string;
  classArmId: string;
  onBack: () => void;
  onAddSubjects: (subjects: Subject[]) => void;
  onShowSuccess: () => void;
}

// Available subjects with their icons and colors
const AVAILABLE_SUBJECTS = [
  { id: 'english', name: 'English Language', icon: '/assets/english.svg', bgColor: 'bg-green-500' },
  { id: 'maths', name: 'Mathematics', icon: '/assets/maths.svg', bgColor: 'bg-red-500' },
  { id: 'biology', name: 'Biology', icon: '/assets/biology.svg', bgColor: 'bg-purple-500' },
  { id: 'chemistry', name: 'Chemistry', icon: '/assets/chem.svg', bgColor: 'bg-yellow-500' },
];

export default function AddSubjectView({ classId, classArmId, onBack, onAddSubjects, onShowSuccess }: AddSubjectViewProps) {
  const [subjectInputs, setSubjectInputs] = useState([{ id: 1, value: '' }]);
  const [nextId, setNextId] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddInput = () => {
    setSubjectInputs([...subjectInputs, { id: nextId, value: '' }]);
    setNextId(nextId + 1);
  };

  const handleRemoveInput = (id: number) => {
    if (subjectInputs.length > 1) {
      setSubjectInputs(subjectInputs.filter(input => input.id !== id));
    }
  };

  const handleInputChange = (id: number, value: string) => {
    setSubjectInputs(subjectInputs.map(input => 
      input.id === id ? { ...input, value } : input
    ));
  };

  const handleSubmit = async () => {
    const validInputs = subjectInputs.filter(input => input.value.trim());
    
    if (validInputs.length === 0) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare API request
      const subjectsToAdd = validInputs.map(input => ({
        name: input.value.trim()
      }));

      // Call API with separate classId and classArmId
      await subjectsApiClient.addSubjectsToClass(classId, classArmId, {
        subjects: subjectsToAdd
      });

      // Create UI subjects for immediate display
      const validSubjects = validInputs.map(input => {
        // Try to match with predefined subjects
        const predefined = AVAILABLE_SUBJECTS.find(s => 
          s.name.toLowerCase().includes(input.value.toLowerCase()) ||
          input.value.toLowerCase().includes(s.name.toLowerCase())
        );
        
        return {
          id: predefined?.id || `custom-${input.id}`,
          name: input.value.trim(),
          icon: predefined?.icon || '/assets/subject-empty.svg',
          bgColor: predefined?.bgColor || 'bg-gray-500'
        };
      });

      // Update UI and show success
      onAddSubjects(validSubjects);
      onShowSuccess();
      
    } catch (err) {
      console.error('Failed to add subjects:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`Failed to add subjects: ${errorMessage}`);
      setShowFailureModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setShowFailureModal(false);
    handleSubmit();
  };

  const handleFailureModalClose = () => {
    setShowFailureModal(false);
    setError(null);
  };

  const isSubmitDisabled = !subjectInputs.some(input => input.value.trim()) || isSubmitting;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-lg font-medium">Add subject</span>
        </button>
      </div>

      {/* Add Subject Form */}
      <div className="bg-white rounded-lg p-6">
        <div className="space-y-4 mb-8">
          {subjectInputs.map((input, index) => (
            <div key={input.id} className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Subject</label>
                <input
                  type="text"
                  value={input.value}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                  placeholder="Subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>
              
              {/* Add/Remove buttons */}
              {index === subjectInputs.length - 1 ? (
                <button
                  onClick={handleAddInput}
                  disabled={isSubmitting}
                  className="mt-6 w-8 h-8 bg-green-500 text-white rounded flex items-center justify-center hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleRemoveInput(input.id)}
                  disabled={isSubmitting}
                  className="mt-6 w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            isSubmitDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding...
            </>
          ) : (
            'Add'
          )}
        </button>
      </div>
      
      {/* Failure Modal */}
      <FailureModal
        isOpen={showFailureModal}
        onClose={handleFailureModalClose}
        title="Error Adding Subjects"
        message={error || 'Failed to add subjects to class. Please check your connection and try again.'}
        onRetry={handleRetry}
        retryText="Try Again"
      />
    </div>
  );
}