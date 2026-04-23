import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import { schoolDocumentsApiClient, SchoolDocument } from '../api/schoolDocumentsApiClient';

const TYPE_LABELS: Record<SchoolDocument['type'], string> = {
	text: 'Text Entry',
	file: 'File Upload',
};

const FILTER_OPTIONS = ['All', 'Text Entry', 'File Upload'] as const;
type Filter = (typeof FILTER_OPTIONS)[number];

export default function SchoolDocumentsPage() {
	const navigate = useNavigate();
	const [documents, setDocuments] = useState<SchoolDocument[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState<Filter>('All');
	const [filterOpen, setFilterOpen] = useState(false);

	useEffect(() => {
		schoolDocumentsApiClient
			.getDocuments()
			.then(setDocuments)
			.catch(() => setDocuments([]))
			.finally(() => setIsLoading(false));
	}, []);

	const filtered = useMemo(() => {
		return documents.filter((doc) => {
			const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase());
			const matchesFilter =
				filter === 'All' ||
				(filter === 'Text Entry' && doc.type === 'text') ||
				(filter === 'File Upload' && doc.type === 'file');
			return matchesSearch && matchesFilter;
		});
	}, [documents, search, filter]);

	return (
		<div className="bg-white rounded-2xl shadow-sm p-8 min-h-[600px]">
			<h1 className="text-2xl font-bold text-[#2b2b2b] mb-6">School Documents</h1>

			{/* Toolbar */}
			<div className="flex items-center gap-3 mb-8">
				{/* Search */}
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
					<input
						type="text"
						placeholder="Search documents"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#fd5d26] transition-colors"
					/>
				</div>

				{/* Filter dropdown */}
				<div className="relative">
					<button
						onClick={() => setFilterOpen((o) => !o)}
						className="flex items-center gap-2 px-4 py-2 border border-[#fd5d26] rounded-lg text-sm text-[#fd5d26] font-medium hover:bg-orange-50 transition-colors"
					>
						{filter}
						<ChevronDown className="w-4 h-4" />
					</button>
					{filterOpen && (
						<div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-10 min-w-[140px] overflow-hidden">
							{FILTER_OPTIONS.map((opt) => (
								<button
									key={opt}
									onClick={() => { setFilter(opt); setFilterOpen(false); }}
									className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
										filter === opt
											? 'bg-orange-50 text-[#fd5d26] font-medium'
											: 'text-gray-700 hover:bg-gray-50'
									}`}
								>
									{opt}
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Document grid */}
			{isLoading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
					))}
				</div>
			) : filtered.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-24 text-center">
					<p className="text-gray-500 font-medium">
						{search || filter !== 'All' ? 'No documents match your search.' : 'No documents available.'}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{filtered.map((doc) => (
						<div
							key={doc.id}
							className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
						>
							<div className="min-w-0">
								<p className="font-semibold text-[#2b2b2b] text-sm truncate">{doc.title}</p>
								<p className="text-xs text-gray-500 mt-0.5">{TYPE_LABELS[doc.type]}</p>
							</div>
							<button
								onClick={() => navigate(`/student/school-documents/${doc.id}`)}
								className="flex-shrink-0 ml-4 px-4 py-1.5 bg-[#fd5d26] text-white text-sm font-semibold rounded-full hover:bg-orange-600 transition-colors"
							>
								View
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
