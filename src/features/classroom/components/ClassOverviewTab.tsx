import { useState, useEffect } from 'react';
import ClassCard from './ClassCard';
import { userApiClient } from '../../user-management/api/userApiClient';
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
  const [classes, setClasses] = useState<ClassroomClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError('Failed to load classes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

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

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center h-48 flex items-center justify-center">
          <div className="text-red-600">
            <p className="text-lg font-medium">Error Loading Classes</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No classes found</p>
            <p className="text-gray-400 text-sm mt-2">Classes will appear here once they are created</p>
          </div>
        ) : (
          classes.map((classData) => (
            <ClassCard key={classData.id} classData={classData} />
          ))
        )}
      </div>
    </div>
  );
}