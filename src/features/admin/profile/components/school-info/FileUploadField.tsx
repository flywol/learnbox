import { Upload } from "lucide-react";

interface FileUploadFieldProps {
  label: string;
  id: string;
  preview: string | null;
  altText: string;
  placeholder: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  error?: string | null;
  helpText?: string;
}

export default function FileUploadField({
  label,
  id,
  preview,
  altText,
  placeholder,
  onFileChange,
  className = "h-20 w-20",
  error,
  helpText
}: FileUploadFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        {preview ? (
          <img src={preview} alt={altText} className={`mx-auto ${className} object-contain`} />
        ) : (
          <div className="text-gray-400">
            <Upload className="mx-auto h-8 w-8 mb-2" />
            <p className="text-sm">{placeholder}</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
          id={id}
        />
        <label
          htmlFor={id}
          className="mt-2 inline-block px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Choose File
        </label>
      </div>
      
      {/* Help Text */}
      {helpText && (
        <p className="text-xs text-gray-500 mt-1">{helpText}</p>
      )}
      
      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}