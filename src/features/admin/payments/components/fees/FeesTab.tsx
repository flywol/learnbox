import { Plus } from 'lucide-react';
import FeeDocumentGrid from './FeeDocumentGrid';
import CreateFeeForm from './CreateFeeForm';

interface FeeDocument {
  id: string;
  title: string;
  classLevel: string;
  session: string;
  term: string;
  amount: number;
  feeType: string;
  fileName: string;
  uploadDate: string;
}

interface FeesTabProps {
  feeDocuments: FeeDocument[];
  showCreateFee: boolean;
  onToggleCreateFee: () => void;
}

export default function FeesTab({ 
  feeDocuments, 
  showCreateFee, 
  onToggleCreateFee 
}: FeesTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Fee Documents</h2>
          <p className="text-gray-600">Manage school fee documents and create new fees</p>
        </div>
        <button
          onClick={onToggleCreateFee}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Fee</span>
        </button>
      </div>

      {showCreateFee && (
        <div className="bg-gray-50 rounded-lg p-6">
          <CreateFeeForm 
            onCancel={onToggleCreateFee}
            classLevels={['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3']}
            sessions={['2023/2024', '2024/2025']}
            terms={['1st Term', '2nd Term', '3rd Term']}
            feeTypes={['Tuition Fee', 'Exam Fee', 'Library Fee', 'Sports Fee']}
          />
        </div>
      )}

      <FeeDocumentGrid 
        documents={feeDocuments} 
        formatCurrency={(amount: number) => `₦${amount.toLocaleString()}`}
      />
    </div>
  );
}