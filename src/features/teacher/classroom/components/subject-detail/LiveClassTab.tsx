import { Student, LiveClass } from '../../types/classroom.types';

interface LiveClassTabProps {
  students: Student[];
  liveClasses: LiveClass[];
}

export default function LiveClassTab({ students, liveClasses }: LiveClassTabProps) {
  // Find the current/active live class (status: 'now')
  const currentClass = liveClasses.find(cls => cls.status === 'now');
  
  // Get status styling
  const getStatusStyle = (status: LiveClass['status']) => {
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

  // Get status text
  const getStatusText = (status: LiveClass['status']) => {
    switch (status) {
      case 'now': return 'Now';
      case 'upcoming': return 'Due in 2 days';
      case 'finished': return 'Finished';
      case 'cancelled': return 'Cancelled';
      default: return '';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Section - Today's Class */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Today's Class</h2>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentClass ? `${currentClass.subject.split(' - ')[0]} Class is starting now` : 'Physics Class is starting now'}
                </h3>
              </div>
              
              <button className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Start
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
      </div>

      {/* Right Section - Classes List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Classes</h2>
        
        <div className="space-y-4">
          {liveClasses.map((liveClass) => {
            const statusStyle = getStatusStyle(liveClass.status);
            const statusText = getStatusText(liveClass.status);
            const isActionable = liveClass.status === 'now' || liveClass.status === 'upcoming';
            
            return (
              <div 
                key={liveClass.id} 
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className={`font-semibold text-lg ${statusStyle.text}`}>
                      {liveClass.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {liveClass.subject.split(' - ')[0]} - {statusText}
                    </p>
                  </div>
                  
                  <button 
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusStyle.button}`}
                    disabled={!isActionable}
                  >
                    {isActionable ? 'Start' : statusText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Section - if you want to show students count */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">{students.length}</span> students enrolled in this subject
          </p>
        </div>
      </div>
    </div>
  );
}