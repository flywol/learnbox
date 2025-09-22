interface ClassArm {
  id: string;
  armName: string;
}

interface ClassLevel {
  id: string;
  class: string;
  arms: ClassArm[];
}

interface ClassArmDetail {
  id: string;
  studentCount?: number;
  assignedTeachers?: Array<{ name: string }>;
}

interface ClassLevelsSectionProps {
  classLevels: ClassLevel[];
  classArms: ClassArmDetail[];
}

export default function ClassLevelsSection({ classLevels, classArms }: ClassLevelsSectionProps) {
  const classArmData = classLevels && classLevels.length > 0 
    ? classLevels
        .filter(level => level.arms.length > 0)
        .slice(0, 8)
        .flatMap(level => 
          level.arms.map(arm => {
            const armDetails = classArms.find(armDetail => armDetail.id === arm.id);
            const assignedTeacher = armDetails?.assignedTeachers?.[0];
            
            return {
              id: `${level.id}-${arm.id}`,
              className: level.class,
              armName: arm.armName,
              teacherName: assignedTeacher?.name || null,
              totalStudents: armDetails?.studentCount || 0
            }
          })
        )
        .slice(0, 8)
    : [];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Class levels/arms</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {classArmData.length > 0 ? (
          classArmData.map((classArm) => (
            <div key={classArm.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                {classArm.className.includes('Junior Secondary School') 
                  ? classArm.className.replace('Junior Secondary School', 'JSS')
                  : classArm.className.includes('Senior Secondary School')
                  ? classArm.className.replace('Senior Secondary School', 'SSS')  
                  : classArm.className}
                /{classArm.armName}
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Teacher: {classArm.teacherName || 'Not assigned'}</p>
                <p>Total students: {classArm.totalStudents}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No class information available
          </div>
        )}
      </div>
    </div>
  );
}