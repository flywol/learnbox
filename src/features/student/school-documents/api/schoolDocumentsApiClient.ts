import BaseApiClient from '@/common/api/baseApiClient';

export interface SchoolDocument {
	id: string;
	title: string;
	type: 'text' | 'file';
	content?: string;
	files?: SchoolDocumentFile[];
}

export interface SchoolDocumentFile {
	name: string;
	url: string;
	size?: string;
	mimeType?: string;
}

function formatSize(bytes: number): string {
	if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${bytes} B`;
}

function mapDocument(raw: any, i: number): SchoolDocument {
	const id = raw._id ?? raw.id ?? String(i);
	const title = raw.title ?? raw.name ?? 'Document';
	const entryType: 'text' | 'file' = raw.entryType === 'text' || raw.type === 'text' || raw.contentType === 'text'
		? 'text'
		: raw.files?.length || raw.fileUrl || raw.fileUrls?.length
		? 'file'
		: raw.content
		? 'text'
		: 'file';

	const files: SchoolDocumentFile[] = [];
	// Handle array of file objects
	if (Array.isArray(raw.files)) {
		raw.files.forEach((f: any) => {
			files.push({
				name: f.name ?? f.fileName ?? f.originalname ?? 'File',
				url: f.url ?? f.fileUrl ?? f.path ?? '',
				size: f.size ? formatSize(Number(f.size)) : f.fileSize ?? undefined,
				mimeType: f.mimeType ?? f.type ?? undefined,
			});
		});
	} else if (raw.fileUrl) {
		files.push({
			name: raw.fileName ?? raw.title ?? 'File',
			url: raw.fileUrl,
			size: raw.fileSize ? formatSize(Number(raw.fileSize)) : undefined,
		});
	} else if (Array.isArray(raw.fileUrls)) {
		raw.fileUrls.forEach((url: string, idx: number) => {
			files.push({ name: `File ${idx + 1}`, url });
		});
	}

	return { id, title, type: entryType, content: raw.content ?? raw.text ?? undefined, files };
}

class SchoolDocumentsApiClient extends BaseApiClient {
	async getDocuments(): Promise<SchoolDocument[]> {
		const res = await this.get<any>('/student/school-documents');
		const data = res?.data?.data ?? res?.data ?? res;
		const list: any[] = Array.isArray(data) ? data : (data?.documents ?? data?.schoolDocuments ?? []);
		return list.map(mapDocument);
	}

	async getDocument(id: string): Promise<SchoolDocument> {
		const res = await this.get<any>(`/student/school-documents/${id}`);
		const data = res?.data?.data ?? res?.data ?? res;
		return mapDocument(data, 0);
	}
}

export const schoolDocumentsApiClient = new SchoolDocumentsApiClient();
