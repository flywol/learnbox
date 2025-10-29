import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { useClassroomStore } from '../store/classroomStore';

export default function AssignmentDetailPage() {
  const navigate = useNavigate();
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { assignments } = useClassroomStore();

  const [response, setResponse] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  // Find the assignment
  const assignment = assignments.find((a) => a.id === assignmentId);

  if (!assignment) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Assignment not found</p>
      </div>
    );
  }

  // Mock assignment questions
  const questions = [
    {
      id: 1,
      text: 'What is the process by which plants convert sunlight into energy?',
    },
    {
      id: 2,
      text: 'Explain the role of chlorophyll in this crucial energy conversion process.',
    },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = () => {
    // TODO: Implement actual submission logic
    console.log('Submitting assignment:', { assignmentId, response, attachments });
    navigate('/student/classroom');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/student/classroom')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <span className="text-sm font-medium text-gray-700">Back</span>
      </div>

      {/* Assignment Info */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
        <p className="text-sm text-gray-600">
          To be submitted by{' '}
          {new Date(assignment.dueDate).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="flex gap-3">
            <span className="text-gray-700 font-medium">{question.id}.</span>
            <p className="text-gray-700">{question.text}</p>
          </div>
        ))}
      </div>

      {/* Response Area */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
        <textarea
          placeholder="Write a comment or attach a file"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="w-full min-h-[120px] text-sm text-gray-700 placeholder:text-gray-400 outline-none resize-none"
        />

        {/* Attachments Display */}
        {attachments.length > 0 && (
          <div className="space-y-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <span>📎</span>
                <span>{file.name}</span>
                <button
                  onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
          <input
            type="file"
            id="file-upload"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <label
            htmlFor="file-upload"
            className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
          >
            <LinkIcon className="w-5 h-5 text-gray-600" />
          </label>
          <label
            htmlFor="file-upload"
            className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
          >
            <ImageIcon className="w-5 h-5 text-gray-600" />
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!response.trim() && attachments.length === 0}
        className="w-full sm:w-auto px-8 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Submit
      </button>
    </div>
  );
}
