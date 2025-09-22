import Modal from '@/common/components/Modal';

interface AdminWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminWelcomeModal({ isOpen, onClose }: AdminWelcomeModalProps) {
  const handleSkip = () => {
    localStorage.setItem('admin-welcome-seen', 'true');
    onClose();
  };

  const handleNext = () => {
    localStorage.setItem('admin-welcome-seen', 'true');
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleSkip}
      maxWidth="2xl"
      showCloseButton={false}
      className="overflow-hidden"
    >
      <div className="text-center">
        {/* Illustration Section */}
        <div className="mb-8 flex justify-center">
          <div className="w-80 h-60">
            <img 
              src="/assets/teacher-welcome.svg" 
              alt="Welcome to Learn Box"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Learn Box
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Start managing your classes, grades, and resources with ease
          </p>
          
          <p className="text-base text-gray-700 mb-4">
            Here's what you can do with your Teacher Portal:
          </p>

          {/* Feature List */}
          <div className="text-left max-w-lg mx-auto space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-orange-500 mt-1">-</span>
              <span className="text-gray-700">Manage classes and course content effortlessly.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-orange-500 mt-1">-</span>
              <span className="text-gray-700">Record and track student grades and progress.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-orange-500 mt-1">-</span>
              <span className="text-gray-700">Engage with students through chats and class discussions.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-orange-500 mt-1">-</span>
              <span className="text-gray-700">Access valuable resources and teaching materials.</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleSkip}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </Modal>
  );
}