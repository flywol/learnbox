import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Eye } from 'lucide-react';
import { schoolDocumentsApiClient, SchoolDocument } from '../api/schoolDocumentsApiClient';

function FileIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 24 24" fill="none">
			<path
				d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
				fill="#fee2e2"
				stroke="#fd5d26"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<polyline
				points="14 2 14 8 20 8"
				stroke="#fd5d26"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export default function SchoolDocumentDetailPage() {
	const navigate = useNavigate();
	const { documentId } = useParams<{ documentId: string }>();
	const [doc, setDoc] = useState<SchoolDocument | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!documentId) return;
		schoolDocumentsApiClient
			.getDocument(documentId)
			.then(setDoc)
			.catch(() => setDoc(null))
			.finally(() => setIsLoading(false));
	}, [documentId]);

	const handleViewFile = (url: string) => {
		window.open(url, '_blank', 'noopener,noreferrer');
	};

	if (isLoading) {
		return (
			<div className="bg-white rounded-2xl shadow-sm p-8 min-h-[400px] animate-pulse">
				<div className="flex items-center gap-4 mb-8">
					<div className="w-8 h-8 bg-gray-100 rounded-lg" />
					<div className="h-5 w-48 bg-gray-100 rounded" />
				</div>
				<div className="h-8 w-64 bg-gray-100 rounded mb-6" />
				<div className="space-y-3">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="h-4 bg-gray-100 rounded" style={{ width: `${85 - i * 8}%` }} />
					))}
				</div>
			</div>
		);
	}

	if (!doc) {
		return (
			<div className="bg-white rounded-2xl shadow-sm p-8 flex items-center justify-center min-h-[400px]">
				<p className="text-gray-500">Document not found.</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-2xl shadow-sm p-8 min-h-[400px]">
			{/* Header row */}
			<div className="flex items-center gap-3 mb-8">
				<button
					onClick={() => navigate('/student/school-documents')}
					className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
					aria-label="Back"
				>
					<ChevronLeft className="w-5 h-5 text-[#2b2b2b]" />
				</button>
				<span className="text-base font-semibold text-[#2b2b2b]">{doc.title}</span>
			</div>

			{/* Document title */}
			<h1 className="text-3xl font-bold text-[#2b2b2b] mb-6">{doc.title}</h1>

			{/* Text content */}
			{doc.type === 'text' && doc.content && (
				<div className="text-[#2b2b2b] leading-relaxed space-y-4 text-base">
					{doc.content.split(/\n{2,}/).map((para, i) => (
						<p key={i}>{para.trim()}</p>
					))}
				</div>
			)}

			{/* File attachments */}
			{doc.type === 'file' && (
				<div className="space-y-3">
					{doc.files && doc.files.length > 0 ? (
						doc.files.map((file, i) => (
							<div
								key={i}
								className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50/50"
							>
								<div className="flex-shrink-0">
									<FileIcon />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-semibold text-[#2b2b2b] truncate">{file.name}</p>
									{file.size && (
										<p className="text-xs text-gray-500 mt-0.5">{file.size}</p>
									)}
								</div>
								<button
									onClick={() => handleViewFile(file.url)}
									className="flex-shrink-0 p-2 hover:bg-gray-200 rounded-lg transition-colors"
									aria-label="View file"
								>
									<Eye className="w-5 h-5 text-gray-600" />
								</button>
							</div>
						))
					) : (
						<p className="text-gray-400 text-sm italic">No files attached to this document.</p>
					)}
				</div>
			)}
		</div>
	);
}
