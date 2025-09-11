import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SuccessModal from '@/common/components/SuccessModal';
import AddTimetableForm from '../components/schedule/AddTimetableForm';

export default function AddTimetablePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get('classId') || '';
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleTimetableSubmit = () => {
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/classroom?tab=schedule&subtab=timetable');
  };

  const handleCancel = () => {
    navigate('/classroom?tab=schedule&subtab=timetable');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AddTimetableForm
          classId={classId}
          onCancel={handleCancel}
          onSubmit={handleTimetableSubmit}
        />
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Success!"
        message="Timetable created successfully!"
        buttonText="Continue"
      />
    </div>
  );
}