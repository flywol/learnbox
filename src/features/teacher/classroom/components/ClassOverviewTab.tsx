import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClassCard from './ClassCard';
import FailureModal from '../../../../common/components/FailureModal';
import { userApiClient } from '../../../admin/user-management/api/userApiClient';
import type { ClassroomClass } from '../types/classroom.types';

// Helper function to generate colors for different classes
const getClassColor = (index: number): string => {
  const colors = [
    'bg-yellow-100 border-yellow-200',
    'bg-blue-100 border-blue-200', 
    'bg-green-100 border-green-200',
    'bg-pink-100 border-pink-200',
    'bg-cyan-100 border-cyan-200',
    'bg-purple-100 border-purple-200',
    'bg-indigo-100 border-indigo-200',
    'bg-red-100 border-red-200',
  ];
  return colors[index % colors.length];
};

export default function ClassOverviewTab() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassroomClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [retryAction, setRetryAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const classLevels = await userApiClient.getClassLevels();
        
        // Transform API data to ClassroomClass format
        const transformedClasses: ClassroomClass[] = classLevels.flatMap((level: any, levelIndex: number) => {
          if (!level.arms || !Array.isArray(level.arms)) {
            // If no arms, create a single class entry
            return [{
              id: level.id,
              name: level.class,
              level: level.levelName,
              arm: '',
              teacher: {
                id: 'teacher-placeholder',
                name: 'Not Assigned', // Default teacher name
              },
              studentCount: level.studentCount || 0,
              color: getClassColor(levelIndex),
            }];
          }
          
          // Create a class entry for each arm
          return level.arms.map((arm: any, armIndex: number) => ({
            id: `${level.id}-${arm.id}`,
            name: `${level.class} ${arm.armName}`,
            level: level.levelName,
            arm: arm.armName,
            teacher: {
              id: arm.assignedTeachers?.[0]?.id || 'teacher-placeholder',
              name: arm.assignedTeachers?.[0]?.name || 'Not Assigned',
            },
            studentCount: arm.studentCount || 0,
            color: getClassColor(levelIndex + armIndex),
          }));
        });
        
        setClasses(transformedClasses);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch classes:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(`Failed to load classes: ${errorMessage}`);
        setShowFailureModal(true);
        setRetryAction(() => fetchClasses);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleRetry = () => {
    setShowFailureModal(false);
    setError(null);
    if (retryAction) {
      retryAction();
    }
  };

  const handleFailureModalClose = () => {
    setShowFailureModal(false);
    setRetryAction(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="text-gray-500 ml-3">Loading classes...</p>
        </div>
      </div>
    );
  }

  if (error && !showFailureModal) {
    return (
      <div className="p-6">
        <div className="text-center h-48 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Classes</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry
              </button>
              <p className="text-xs text-gray-400">
                Check your internet connection and try again
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Classes Yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              You haven't set up any classes yet. Classes will appear here once they are created through the school setup process.
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/dashboard/complete-school-setup')}
                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Set Up Classes
              </button>
              <p className="text-xs text-gray-400 mt-2">
                Or contact your administrator to set up classes
              </p>
            </div>
          </div>
        ) : (
          classes.map((classData) => (
            <ClassCard key={classData.id} classData={classData} />
          ))
        )}
      </div>
      
      {/* Failure Modal */}
      <FailureModal
        isOpen={showFailureModal}
        onClose={handleFailureModalClose}
        title="Error Loading Classes"
        message={error || 'Failed to load class information. Please check your connection and try again.'}
        onRetry={handleRetry}
        retryText="Retry Loading"
      />
    </div>
  );
}