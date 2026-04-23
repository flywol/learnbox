import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { studentApiClient } from '@/features/student/api/studentApiClient';
import type { ApiAssignment } from '@/features/student/api/studentApiClient';

export default function AssignmentDetailPage() {
  const navigate = useNavigate();
  const { assignmentId } = useParams<{ assignmentId: string }>();

  const [assignment, setAssignment] = useState<ApiAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!assignmentId) return;
    studentApiClient.getAssignment(assignmentId)
      .then((data) => setAssignment(data))
      .catch(() => setAssignment(null))
      .finally(() => setIsLoading(false));
  }, [assignmentId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleSubmit = async () => {
    if (!assignmentId) return;
    setIsSubmitting(true);
    try {
      await studentApiClient.submitAssignment(assignmentId, {
        textContent: response || undefined,
        files: attachments.length ? attachments : undefined,
      });
      navigate('/student/classroom');
    } catch {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-gray-100 rounded-xl" />
          <div className="space-y-2">
            <div className="h-7 w-56 bg-gray-100 rounded" />
            <div className="h-4 w-36 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="h-48 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Assignment not found</p>
      </div>
    );
  }

  const title =
    typeof assignment === 'object' && 'title' in assignment
      ? (assignment as any).title ?? 'Assignment'
      : 'Assignment';

  const dueDate = (assignment as any).dueDate;
  const description = (assignment as any).description ?? '';
  const questions: any[] = (assignment as any).questions ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/student/classroom')}
          className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group"
        >
          <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span>Assignment</span>
            {dueDate && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-orange-600 font-medium">
                  Due {new Date(dueDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            {description && (
              <p className="text-gray-700 mb-6 leading-relaxed">{description}</p>
            )}
            {questions.length > 0 ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Questions</h2>
                <div className="space-y-6">
                  {questions.map((question: any, idx: number) => (
                    <div key={question._id ?? question.id ?? idx} className="flex gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-gray-200 text-sm font-bold text-gray-700 shadow-sm">
                        {idx + 1}
                      </span>
                      <p className="text-gray-700 leading-relaxed pt-1">
                        {question.text ?? question.question ?? question.content ?? ''}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              !description && (
                <p className="text-gray-500 text-sm">No additional instructions provided.</p>
              )
            )}
          </div>
        </div>

        {/* Right Column: Submission */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Your Submission</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                <textarea
                  placeholder="Type your answer here..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="w-full min-h-[160px] p-4 text-sm text-gray-700 placeholder:text-gray-400 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                />
              </div>

              {/* Attachments */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Attachments</label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <label
                      htmlFor="file-upload"
                      className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors text-gray-500 hover:text-gray-700"
                      title="Attach file"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </label>
                    <label
                      htmlFor="file-upload"
                      className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors text-gray-500 hover:text-gray-700"
                      title="Add image"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </label>
                  </div>
                </div>

                {attachments.length > 0 ? (
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-lg">
                          📄
                        </div>
                        <span className="text-sm text-gray-600 truncate flex-1">{file.name}</span>
                        <button
                          onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <span className="sr-only">Remove</span>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                    <p className="text-xs text-gray-400">No files attached</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={(!response.trim() && attachments.length === 0) || isSubmitting}
                className="w-full py-3.5 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-all shadow-sm hover:shadow-md disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed mt-4"
              >
                {isSubmitting ? 'Submitting…' : 'Submit Assignment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
