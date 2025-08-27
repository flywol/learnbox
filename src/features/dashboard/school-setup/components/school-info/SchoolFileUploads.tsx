import FileUploadZone from "../FileUploadZone";

interface SchoolFileUploadsProps {
  schoolLogo?: string | File;
  principalSignature?: string | File;
  onLogoUpload: (file: File) => void;
  onSignatureUpload: (file: File) => void;
}

export default function SchoolFileUploads({ 
  schoolLogo, 
  principalSignature, 
  onLogoUpload, 
  onSignatureUpload 
}: SchoolFileUploadsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School logo
        </label>
        <FileUploadZone
          onFileSelect={onLogoUpload}
          accept="image/*"
          maxSize={5 * 1024 * 1024}
          currentFile={schoolLogo}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Principal's signature
        </label>
        <FileUploadZone
          onFileSelect={onSignatureUpload}
          accept="image/*"
          maxSize={5 * 1024 * 1024}
          currentFile={principalSignature}
        />
      </div>
    </div>
  );
}