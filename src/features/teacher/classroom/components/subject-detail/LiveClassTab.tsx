import { Video, Upload, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLiveClassesBySubject, useUploadRecording, useDeleteLiveClass } from '../../hooks/useLiveClasses';
import { transformLiveClassForUI } from '../../utils/liveClassUtils';
import type { LiveClassForUI } from '../../types/liveClass.types';

interface LiveClassTabProps {
  subjectId: string;
  classId: string;
  classArmId?: string;
  subjectName: string;
  students: any[]; // Keep for student count display
}

export default function LiveClassTab({ subjectId, classId, classArmId, students }: LiveClassTabProps) {
  const navigate = useNavigate();

  // Fetch live classes for this subject
  const { data: liveClasses = [], isLoading } = useLiveClassesBySubject({
    classId,
    subjectId,
    classArmId,
  });

  const uploadRecordingMutation = useUploadRecording();
  const deleteMutation = useDeleteLiveClass();

  // Transform API data to UI format
  const uiClasses: LiveClassForUI[] = liveClasses.map(transformLiveClassForUI);

  // Find current/active live class
  const currentClass = uiClasses.find(cls => cls.status === 'now');

  const handleStartClass = (classLink: string) => {
    window.open(classLink, '_blank', 'noopener,noreferrer');
  };

  const handleUploadRecording = async (id: string) => {
    const url = prompt('Enter recording URL:');
    if (url) {
      await uploadRecordingMutation.mutateAsync({ id, recordingUrl: url });
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (confirm('Are you sure you want to delete this live class?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const getStatusStyle = (status: LiveClassForUI['status']) => {
    switch (status) {
      case 'now':
        return {
          button: 'bg-orange-500 hover:bg-orange-600 text-white',
          text: 'text-gray-900'
        };
      case 'upcoming':
        return {
          button: 'bg-orange-500 hover:bg-orange-600 text-white',
          text: 'text-gray-600'
        };
      case 'finished':
        return {
          button: 'bg-gray-200 text-gray-500 cursor-not-allowed',
          text: 'text-gray-500'
        };
      case 'cancelled':
        return {
          button: 'bg-gray-200 text-gray-500 cursor-not-allowed',
          text: 'text-gray-500'
        };
      default:
        return {
          button: 'bg-gray-200 text-gray-500',
          text: 'text-gray-600'
        };
    }
  };

  const getStatusText = (status: LiveClassForUI['status']) => {
    switch (status) {
      case 'now': return 'Now';
      case 'upcoming': return 'Upcoming';
      case 'finished': return 'Finished';
      case 'cancelled': return 'Cancelled';
      default: return '';
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-gray-600">Loading live classes...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Live Classes</h2>
        <button
          onClick={() => navigate(`/teacher/subject/${subjectId}/live-class/create`)}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Live Class
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section - Today's Class */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Today's Class</h3>

          {currentClass ? (
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {currentClass.title}
                    </h3>
                    <p className="text-gray-700">{currentClass.description}</p>
                  </div>

                  <button
                    onClick={() => handleStartClass(currentClass.classLink)}
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <Video className="w-5 h-5" />
                    Start Class
                  </button>
                </div>

                {/* Class Illustration */}
                <div className="hidden md:block">
                  <img
                    src="/assets/class-illustration.svg"
                    alt="Live class illustration"
                    className="w-80 h-64 object-contain"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <p className="text-gray-600">No live class scheduled for now</p>
            </div>
          )}
        </div>

        {/* Right Section - Classes List */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">All Classes</h3>

          <div className="space-y-4">
            {uiClasses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No live classes created yet
              </div>
            ) : (
              uiClasses.map((liveClass) => {
                const statusStyle = getStatusStyle(liveClass.status);
                const statusText = getStatusText(liveClass.status);
                const isActionable = liveClass.status === 'now' || liveClass.status === 'upcoming';

                return (
                  <div
                    key={liveClass.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className={`font-semibold text-lg ${statusStyle.text}`}>
                          {liveClass.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {liveClass.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {liveClass.dueDate} at {liveClass.time} • {liveClass.duration}
                        </p>

                        {/* Recording URL if available */}
                        {liveClass.recordingUrl && (
                          <a
                            href={liveClass.recordingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-orange-600 hover:underline mt-2 inline-block"
                          >
                            View Recording
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Start Button */}
                        <button
                          onClick={() => handleStartClass(liveClass.classLink)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusStyle.button}`}
                          disabled={!isActionable}
                        >
                          {isActionable ? 'Start' : statusText}
                        </button>

                        {/* Upload Recording (for finished classes) */}
                        {liveClass.status === 'finished' && !liveClass.recordingUrl && (
                          <button
                            onClick={() => handleUploadRecording(liveClass.id)}
                            className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Upload Recording"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteClass(liveClass.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Student Count */}
          {students.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{students.length}</span> students enrolled in this subject
              </p>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
