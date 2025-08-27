interface Subject {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
}

interface SubjectCardProps {
  subject: Subject;
  onClick?: () => void;
}

export default function SubjectCard({ subject, onClick }: SubjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-3 mb-3">
        <img 
          src={subject.icon} 
          alt={subject.name}
          className="w-10 h-10"
        />
        <h3 className="font-semibold text-gray-900">{subject.name}</h3>
      </div>
      
      <div className="text-sm text-gray-600 space-y-1">
        <p>Teacher: Peter Red</p>
        <p>Total students: 40</p>
      </div>
    </div>
  );
}