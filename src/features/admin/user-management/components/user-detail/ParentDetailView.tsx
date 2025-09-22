import type { DetailedUser } from "../../types/user.types";

interface ParentDetailViewProps {
  user: DetailedUser;
}

export default function ParentDetailView({ user }: ParentDetailViewProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Relationship to student</label>
          <p className="text-gray-900">{user.relationshipToStudent || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <p className="text-gray-900">{user.gender || 'N/A'}</p>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
          <p className="text-gray-900">{user.phoneNumber || 'N/A'}</p>
        </div>
      </div>
      
      {/* Linked Children */}
      {user.linkedChildren && user.linkedChildren.length > 0 && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Linked children</label>
          <div className="flex flex-wrap gap-2">
            {user.linkedChildren.map((childId, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
              >
                {childId}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}