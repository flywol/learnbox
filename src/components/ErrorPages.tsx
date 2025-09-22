export const UnauthorizedPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Unauthorized</h1>
      <p className="text-gray-600 mb-4">
        You don't have permission to access this page.
      </p>
      <a href="/" className="text-orange-500 hover:underline">
        Go back to home
      </a>
    </div>
  </div>
);

export const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        404: Page Not Found
      </h1>
      <p className="text-gray-600 mb-4">
        The page you're looking for doesn't exist.
      </p>
      <a href="/dashboard" className="text-orange-500 hover:underline">
        Go back to dashboard
      </a>
    </div>
  </div>
);

// Layout-aware 404 page (shows within the existing layout)
export const LayoutNotFoundPage = () => (
  <div className="flex items-center justify-center py-20">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        404: Page Not Found
      </h1>
      <p className="text-gray-600 mb-4">
        The page you're looking for doesn't exist.
      </p>
      <a href="/dashboard" className="text-orange-500 hover:underline">
        Go back to dashboard
      </a>
    </div>
  </div>
);

export const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
      <span className="text-gray-600">Loading...</span>
    </div>
  </div>
);