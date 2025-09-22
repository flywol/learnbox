import { FileText, MoreVertical } from 'lucide-react';

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

interface FeeDocumentGridProps {
  documents: FeeDocument[];
  formatCurrency: (amount: number) => string;
}

export default function FeeDocumentGrid({ documents, formatCurrency }: FeeDocumentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <div key={doc.id} className="bg-white p-4 rounded-lg border border-gray-200">
          {/* Document Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {doc.title}
                </h3>
              </div>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          {/* Document Preview */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="w-full h-32 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-xs text-gray-500">PDF Preview</div>
              </div>
            </div>
          </div>

          {/* Document Details */}
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Class:</span>
              <span className="font-medium">{doc.classLevel}</span>
            </div>
            <div className="flex justify-between">
              <span>Session:</span>
              <span className="font-medium">{doc.session}</span>
            </div>
            <div className="flex justify-between">
              <span>Term:</span>
              <span className="font-medium">{doc.term}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-medium">{formatCurrency(doc.amount)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}