/**
 * Reusable loading skeleton components
 */

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
	const sizeClasses = {
		sm: "h-8 w-8 border-2",
		md: "h-12 w-12 border-b-2",
		lg: "h-16 w-16 border-b-2",
	};

	return (
		<div className="flex justify-center items-center py-12">
			<div
				className={`animate-spin rounded-full border-orange-500 ${sizeClasses[size]}`}
			/>
		</div>
	);
}

export function CardSkeleton({ count = 1 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{Array.from({ length: count }).map((_, index) => (
				<div
					key={index}
					className="bg-white rounded-lg p-5 border border-gray-200 animate-pulse">
					<div className="w-14 h-14 bg-gray-200 rounded-full mb-4" />
					<div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
					<div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
					<div className="h-2 bg-gray-200 rounded w-full mb-2" />
					<div className="h-4 bg-gray-200 rounded w-1/4" />
				</div>
			))}
		</div>
	);
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
	return (
		<div className="space-y-3">
			{Array.from({ length: count }).map((_, index) => (
				<div
					key={index}
					className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-gray-200 rounded-lg" />
						<div className="flex-1">
							<div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
							<div className="h-3 bg-gray-200 rounded w-1/3" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

export function DashboardSkeleton() {
	return (
		<div className="space-y-6">
			{/* Welcome Banner Skeleton */}
			<div className="bg-gray-200 rounded-lg p-6 animate-pulse h-32" />

			{/* Overview Stats Skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="bg-white rounded-lg p-5 border border-gray-200 animate-pulse">
						<div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
						<div className="h-8 bg-gray-200 rounded w-1/3 mb-2" />
						<div className="h-3 bg-gray-200 rounded w-2/3" />
					</div>
				))}
			</div>

			{/* Recent Classes Skeleton */}
			<CardSkeleton count={3} />
		</div>
	);
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
	return (
		<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
			<div className="animate-pulse">
				{/* Header */}
				<div className="grid gap-4 p-4 bg-gray-50 border-b border-gray-200" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
					{Array.from({ length: columns }).map((_, i) => (
						<div key={i} className="h-4 bg-gray-200 rounded" />
					))}
				</div>
				{/* Rows */}
				{Array.from({ length: rows }).map((_, rowIndex) => (
					<div
						key={rowIndex}
						className="grid gap-4 p-4 border-b border-gray-200 last:border-b-0"
						style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
						{Array.from({ length: columns }).map((_, colIndex) => (
							<div key={colIndex} className="h-4 bg-gray-200 rounded" />
						))}
					</div>
				))}
			</div>
		</div>
	);
}
