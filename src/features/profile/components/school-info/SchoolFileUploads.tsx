import FileUploadField from "./FileUploadField";

interface SchoolFileUploadsProps {
  logoPreview: string | null;
  signaturePreview: string | null;
  onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSignatureUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SchoolFileUploads({
  logoPreview,
  signaturePreview,
  onLogoUpload,
  onSignatureUpload
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
      />
      
      <FileUploadField
        label="Principal Signature"
        id="principalSignature"
        preview={signaturePreview}
        altText="Principal Signature"
        placeholder="Upload signature"
        onFileChange={onSignatureUpload}
        className="h-20 w-40"
      />
    </div>
  );
}