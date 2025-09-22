interface ClassArmsHeaderProps {
  apiError: string | null;
}

export default function ClassArmsHeader({ apiError }: ClassArmsHeaderProps) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-6">Add Class Arms</h2>
      <div className="mb-8">
        <p className="text-gray-600 mb-3">
          Configure the class arms (sections) for each level. Select the arms you want to use.
        </p>
        <div className="text-sm text-gray-500 space-y-1">
          <p>• <span className="font-medium">Template class:</span> The first class acts as a template - changes apply to all classes automatically</p>
          <p>• <span className="font-medium">Individual editing:</span> Other classes can be edited individually after the template is set</p>
          <p>• <span className="font-medium">Add custom arms:</span> Click "Customize your class arms" to create arms for all classes at once</p>
          <p>• <span className="font-medium">Delete all:</span> Use "Delete All" button to clear all arms for a class</p>
        </div>
      </div>

      {apiError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {apiError}
        </div>
      )}
    </>
  );
}