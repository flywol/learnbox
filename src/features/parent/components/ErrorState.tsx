import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
	title?: string;
	message?: string;
	onRetry?: () => void;
	showRetry?: boolean;
}

export default function ErrorState({
	title = "Something went wrong",
	message = "We're having trouble loading this data. Please try again.",
	onRetry,
	showRetry = true,
}: ErrorStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-12 px-4">
			<div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
				<AlertCircle className="w-8 h-8 text-red-500" />
			</div>
			<h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
			<p className="text-sm text-gray-600 text-center mb-6 max-w-md">
				{message}
			</p>
			{showRetry && onRetry && (
				<button
					onClick={onRetry}
					className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
					<RefreshCw className="w-4 h-4" />
					Try Again
				</button>
			)}
		</div>
	);
}

/**
 * Helper function to get user-friendly error messages
 */
export function getErrorMessage(error: any): string {
	// Network errors
	if (error?.message === "Network Error" || !navigator.onLine) {
		return "No internet connection. Please check your network and try again.";
	}

	// API errors with response
	if (error?.response?.data?.message) {
		return error.response.data.message;
	}

	// Timeout errors
	if (error?.code === "ECONNABORTED") {
		return "Request timed out. Please check your connection and try again.";
	}

	// Authentication errors
	if (error?.response?.status === 401) {
		return "Your session has expired. Please log in again.";
	}

	// Authorization errors
	if (error?.response?.status === 403) {
		return "You don't have permission to access this resource.";
	}

	// Not found errors
	if (error?.response?.status === 404) {
		return "The requested data could not be found.";
	}

	// Server errors
	if (error?.response?.status >= 500) {
		return "Our servers are experiencing issues. Please try again later.";
	}

	// Default fallback
	return "An unexpected error occurred. Please try again.";
}
