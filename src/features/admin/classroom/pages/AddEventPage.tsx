import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AddEventForm from '../components/schedule/AddEventForm';
import SuccessModal from '@/common/components/SuccessModal';

export default function AddEventPage() {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Handle successful event creation
  const handleEventSubmit = () => {
    setShowSuccessModal(true);
  };

  // Handle success modal close
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Navigate back to the classroom schedule calendar tab
    navigate('/admin/classroom?tab=schedule&subtab=calendar');
  };

  // Handle cancel/back navigation
  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Event</h1>
              <p className="text-sm text-gray-500 mt-1">
                Create a new event for your classroom calendar
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <AddEventForm
            onCancel={handleCancel}
            onSubmit={handleEventSubmit}
          />
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Event Created!"
        message="Your event has been created successfully and added to the calendar."
        buttonText="View Calendar"
      />
    </div>
  );
}