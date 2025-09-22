import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { userApiClient } from "../api/userApiClient";

interface Student {
  id: string;
  fullName: string;
  classLevel: string;
  classArm: string;
  admissionNumber: string;
}

interface ChildSelectorProps {
  selectedChildren: string[];
  onChildrenChange: (children: string[]) => void;
  error?: string;
}

export default function ChildSelector({ selectedChildren, onChildrenChange, error }: ChildSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all students once on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const fetchedStudents = await userApiClient.getStudents();
        setAllStudents(fetchedStudents);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStudents([]);
      setIsOpen(false);
      return;
    }

    const filtered = allStudents.filter(student =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredStudents(filtered);
    setIsOpen(filtered.length > 0);
  }, [searchTerm, allStudents]);

  const handleChildToggle = (student: Student) => {
    if (selectedChildren.includes(student.id)) {
      onChildrenChange(selectedChildren.filter(id => id !== student.id));
    } else {
      onChildrenChange([...selectedChildren, student.id]);
    }
    
    // Clear search after selection
    setSearchTerm("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleRemoveChild = (studentId: string) => {
    onChildrenChange(selectedChildren.filter(id => id !== studentId));
  };

  const getSelectedStudent = (studentId: string) => {
    return allStudents.find(s => s.id === studentId);
  };

  const handleInputFocus = () => {
    if (searchTerm.trim() && filteredStudents.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding to allow clicks on dropdown items
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Link children *
      </label>
      
      {/* Selected children as chips */}
      {selectedChildren.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedChildren.map((studentId) => {
            const student = getSelectedStudent(studentId);
            return (
              <div
                key={studentId}
                className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-lg text-sm"
              >
                <span>{student?.fullName || studentId}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveChild(studentId)}
                  className="text-orange-600 hover:text-orange-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Search for your child's name..."
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </div>

        {/* Search results dropdown */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-2 text-sm text-gray-500">Loading students...</div>
            ) : filteredStudents.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                {searchTerm ? 'No students found matching your search' : 'Start typing to search for students'}
              </div>
            ) : (
              filteredStudents.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => handleChildToggle(student)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                    selectedChildren.includes(student.id) ? 'bg-orange-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 font-medium">{student.fullName}</div>
                      <div className="text-xs text-gray-500">
                        {student.classLevel} {student.classArm} • {student.admissionNumber}
                      </div>
                    </div>
                    {selectedChildren.includes(student.id) && (
                      <div className="text-orange-600 text-sm">✓ Selected</div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {/* Helper text */}
      <p className="text-xs text-gray-500">
        Start typing your child's name to search and select multiple children
      </p>
    </div>
  );
}