import { FileText } from "lucide-react";
import { LessonContentItem } from "../../types/classroom.types";

interface DocumentContentProps {
  contentItem: LessonContentItem;
}

export default function DocumentContent({ contentItem }: DocumentContentProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Document Header */}
      <div className="flex items-start gap-4">
        <div className="bg-blue-100 p-4 rounded-xl">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{contentItem.title}</h2>
          {contentItem.description && (
            <p className="text-gray-600 text-lg mt-2">{contentItem.description}</p>
          )}
        </div>
      </div>

      {/* Document Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        {contentItem.content ? (
          <div className="prose prose-lg max-w-none">
            <div
              className="text-gray-700 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: contentItem.content }}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Document content will be displayed here</p>
          </div>
        )}
      </div>

      {/* Optional: Downloadable Resources */}
      {contentItem.attachments && contentItem.attachments.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6 space-y-3">
          <h3 className="font-semibold text-gray-900">Attachments</h3>
          <div className="space-y-2">
            {contentItem.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment.url}
                download
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-500 transition-colors"
              >
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{attachment.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
