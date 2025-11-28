import { ClipboardList, Upload } from "lucide-react";
import { LessonContentItem } from "../../types/classroom.types";

interface AssignmentContentProps {
  contentItem: LessonContentItem;
}

export default function AssignmentContent({ contentItem }: AssignmentContentProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Assignment Header */}
      <div className="flex items-start gap-4">
        <div className="bg-orange-100 p-4 rounded-xl">
          <ClipboardList className="w-8 h-8 text-orange-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{contentItem.title}</h2>
          {contentItem.description && (
            <p className="text-gray-600 text-lg mt-2">{contentItem.description}</p>
          )}
        </div>
      </div>

      {/* Assignment Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
        {/* Instructions */}
        {contentItem.content && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Instructions</h3>
            <div
              className="text-gray-700 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: contentItem.content }}
            />
          </div>
        )}

        {/* Assignment Placeholder - Will integrate with existing assignment system */}
        <div className="border-t border-gray-200 pt-6">
          <div className="text-center py-8">
            <Upload className="w-12 h-12 text-orange-300 mx-auto mb-4" />
            <p className="text-gray-700 font-medium mb-2">Submit Your Assignment</p>
            <p className="text-gray-500 mb-6">Upload your completed work below</p>

            {/* This will integrate with the existing assignment submission flow */}
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Assignment
            </button>

            <p className="text-sm text-gray-500 mt-4">
              Assignment submission integration coming soon
            </p>
          </div>
        </div>
      </div>

      {/* Optional: Resources/Attachments */}
      {contentItem.attachments && contentItem.attachments.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6 space-y-3">
          <h3 className="font-semibold text-gray-900">Assignment Resources</h3>
          <div className="space-y-2">
            {contentItem.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment.url}
                download
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-500 transition-colors"
              >
                <ClipboardList className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{attachment.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
