import FileUploadField from "./FileUploadField";

interface SchoolFileUploadsProps {
  logoPreview: string | null;
  signaturePreview: string | null;
  onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSignatureUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  logoError?: string | null;
  signatureError?: string | null;
}

export default function SchoolFileUploads({
  logoPreview,
  signaturePreview,
  onLogoUpload,
  onSignatureUpload,
  logoError,
  signatureError
}: SchoolFileUploadsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FileUploadField
        label="School Logo"
        id="schoolLogo"
        preview={logoPreview}
        altText="School Logo"
        placeholder="Upload school logo"
        onFileChange={onLogoUpload}
        className="h-20 w-20"
        error={logoError}
        helpText="Max size: 3MB (JPEG, PNG only)"
      />
      
      <FileUploadField
        label="Principal Signature"
        id="principalSignature"
        preview={signaturePreview}
        altText="Principal Signature"
        placeholder="Upload signature"
        onFileChange={onSignatureUpload}
        className="h-20 w-40"
        error={signatureError}
        helpText="Max size: 3MB (JPEG, PNG only)"
      />
    </div>
  );
}