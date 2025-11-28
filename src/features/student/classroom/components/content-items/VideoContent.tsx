import { LessonContentItem } from "../../types/classroom.types";

interface VideoContentProps {
  contentItem: LessonContentItem;
}

export default function VideoContent({ contentItem }: VideoContentProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Video Player */}
      <div className="bg-black overflow-hidden aspect-video">
        <video
          controls
          className="w-full h-full"
          src={contentItem.url || ''}
          poster={contentItem.thumbnail}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video Title and Description */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">{contentItem.title}</h2>
        {contentItem.description && (
          <p className="text-gray-600 text-lg">{contentItem.description}</p>
        )}
      </div>

      {/* Optional: Video Transcript or Additional Notes */}
      {contentItem.notes && (
        <div className="bg-gray-50 rounded-xl p-6 space-y-3">
          <h3 className="font-semibold text-gray-900">Notes</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{contentItem.notes}</p>
        </div>
      )}
    </div>
  );
}
