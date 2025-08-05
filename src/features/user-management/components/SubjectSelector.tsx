import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { SUBJECTS } from "../types/user.types";

interface SubjectSelectorProps {
  selectedSubjects: string[];
  onSubjectsChange: (subjects: string[]) => void;
  error?: string;
}

export default function SubjectSelector({ selectedSubjects, onSubjectsChange, error }: SubjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubjectToggle = (subjectId: string) => {
    if (selectedSubjects.includes(subjectId)) {
      onSubjectsChange(selectedSubjects.filter(id => id !== subjectId));
    } else {
      onSubjectsChange([...selectedSubjects, subjectId]);
    }
  };

  const handleRemoveSubject = (subjectId: string) => {
    onSubjectsChange(selectedSubjects.filter(id => id !== subjectId));
  };

  const getSubjectName = (subjectId: string) => {
    return SUBJECTS.find(s => s.id === subjectId)?.name || subjectId;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Assign subject *
      </label>
      
      {/* Selected subjects as chips */}
      {selectedSubjects.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedSubjects.map((subjectId) => (
            <div
              key={subjectId}
              className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-lg text-sm"
            >
              <span>{getSubjectName(subjectId)}</span>
              <button
                type="button"
                onClick={() => handleRemoveSubject(subjectId)}
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
              {selectedSubjects.length > 0 
                ? `${selectedSubjects.length} subject${selectedSubjects.length > 1 ? 's' : ''} selected`
                : 'Select subjects'
              }
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {SUBJECTS.map((subject) => (
              <label
                key={subject.id}
                className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(subject.id)}
                  onChange={() => handleSubjectToggle(subject.id)}
                  className="mr-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-900">{subject.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}