import { useState } from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
}

interface AddSubjectViewProps {
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

export default function AddSubjectView({ onBack, onAddSubjects, onShowSuccess }: AddSubjectViewProps) {
  const [subjectInputs, setSubjectInputs] = useState([{ id: 1, value: '' }]);
  const [nextId, setNextId] = useState(2);

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

  const handleSubmit = () => {
    const validSubjects = subjectInputs
      .filter(input => input.value.trim())
      .map(input => {
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

    if (validSubjects.length > 0) {
      onAddSubjects(validSubjects);
      onShowSuccess();
    }
  };

  const isSubmitDisabled = !subjectInputs.some(input => input.value.trim());

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
                />
              </div>
              
              {/* Add/Remove buttons */}
              {index === subjectInputs.length - 1 ? (
                <button
                  onClick={handleAddInput}
                  className="mt-6 w-8 h-8 bg-green-500 text-white rounded flex items-center justify-center hover:bg-green-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleRemoveInput(input.id)}
                  className="mt-6 w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center hover:bg-red-600"
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
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isSubmitDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          Add
        </button>
      </div>
    </div>
  );
}