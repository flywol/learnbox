import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import { mockBroadsheetData } from '../data/mockData';

export default function BroadsheetTab() {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('JSS 2');
  
  const handleExport = () => {
    // Mock export functionality
  };

  const getGradeForStudent = (studentId: string, subject: string) => {
    const grade = mockBroadsheetData.grades.find(
      g => g.studentId === studentId && g.subject === subject
    );
    return grade?.score ?? '--';
  };

  // Check if we have any students with grades
  const hasStudentsWithGrades = mockBroadsheetData.students.length > 0 && mockBroadsheetData.grades.length > 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">
            BROADSHEET REPORT FOR {mockBroadsheetData.session} SESSION | CLASS: {selectedClass}A | TERM: {mockBroadsheetData.term}
          </h2>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-orange-300 text-orange-600 rounded-lg px-4 py-2"
          >
            <option>JSS 1</option>
            <option>JSS 2</option>
            <option>JSS 3</option>
            <option>SSS 1</option>
            <option>SSS 2</option>
            <option>SSS 3</option>
          </select>
          
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Broadsheet Table */}
      {!hasStudentsWithGrades ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H4a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assessment Data Available</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            There are no assessment results for {selectedClass} yet. Students need to complete assessments before the broadsheet can be generated.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/assessment')}
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Manage Assessments
            </button>
            <p className="text-xs text-gray-400">
              Create and manage student assessments
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-orange-50">
              <th className="border border-gray-300 px-4 py-3 text-left font-medium">S/N</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-medium">Student Name</th>
              {mockBroadsheetData.subjects.map((subject) => (
                <th key={subject} className="border border-gray-300 px-4 py-3 text-center font-medium">
                  {subject}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockBroadsheetData.students.map((student, index) => (
              <tr key={student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-4 py-3 text-center">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">
                        {student.name.charAt(0)}
                      </span>
                    </div>
                    <span>{student.name}</span>
                  </div>
                </td>
                {mockBroadsheetData.subjects.map((subject) => (
                  <td key={`${student.id}-${subject}`} className="border border-gray-300 px-4 py-3 text-center">
                    {getGradeForStudent(student.id, subject)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}