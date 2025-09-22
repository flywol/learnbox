// src/features/school-setup/components/FileUploadZone.tsx
import { useState, useRef } from "react";
import { X, FileImage } from "lucide-react";

interface FileUploadZoneProps {
	onFileSelect: (file: File) => void;
	accept?: string;
	maxSize?: number;
	currentFile?: File | string;
}

export default function FileUploadZone({
	onFileSelect,
	accept = "image/*",
	maxSize = 5 * 1024 * 1024, // 5MB default
	currentFile,
}: FileUploadZoneProps) {
	const [preview, setPreview] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Set preview if currentFile exists
	useState(() => {
		if (currentFile) {
			if (typeof currentFile === "string") {
				setPreview(currentFile);
			} else if (currentFile instanceof File) {
				const reader = new FileReader();
				reader.onloadend = () => {
					setPreview(reader.result as string);
				};
				reader.readAsDataURL(currentFile);
			}
		}
	});

	const handleFileSelect = (file: File) => {
		setError(null);

		// Validate file size
		if (file.size > maxSize) {
			setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
			return;
		}

		// Validate file type
		if (accept && !file.type.match(accept.replace("*", ".*"))) {
			setError("Invalid file type");
			return;
		}

		// Create preview for images
		if (file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}

		onFileSelect(file);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);

		const file = e.dataTransfer.files[0];
		if (file) {
			handleFileSelect(file);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const handleRemove = () => {
		setPreview(null);
		setError(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="relative">
			<input
				ref={fileInputRef}
				type="file"
				accept={accept}
				onChange={(e) => {
					const file = e.target.files?.[0];
					if (file) handleFileSelect(file);
				}}
				className="hidden"
			/>

			{preview ? (
				<div className="relative border-2 border-gray-300 border-dashed rounded-lg p-4">
					<img
						src={preview}
						alt="Preview"
						className="w-full h-32 object-contain"
					/>
					<button
						onClick={handleRemove}
						className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
						<X className="w-4 h-4" />
					</button>
				</div>
			) : (
				<div
					onClick={handleClick}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${
							isDragging
								? "border-orange-500 bg-orange-50"
								: "border-gray-300 hover:border-gray-400"
						}
          `}>
					<FileImage className="w-12 h-12 mx-auto mb-4 text-gray-400" />
					<p className="text-sm text-gray-600 mb-1">
						Drag and drop or{" "}
						<span className="text-orange-500 font-medium">select image</span> to
						upload
					</p>
					<p className="text-xs text-gray-500">
						Maximum file size: {maxSize / (1024 * 1024)}MB
					</p>
				</div>
			)}

			{error && <p className="mt-2 text-sm text-red-600">{error}</p>}
		</div>
	);
}
