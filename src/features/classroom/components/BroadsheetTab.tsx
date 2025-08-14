import { useState } from 'react';
import { Download } from 'lucide-react';
import { mockBroadsheetData } from '../data/mockData';

export default function BroadsheetTab() {
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
    </div>
  );
}