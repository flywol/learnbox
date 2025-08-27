import { Camera } from "lucide-react";
import { UseFormSetValue } from "react-hook-form";
import UserAvatar from "../UserAvatar";

interface ProfileImageUploadProps {
  currentImage: string | null;
  userName: string;
  onImageChange: (preview: string | null) => void;
  setValue: UseFormSetValue<any>;
}

export default function ProfileImageUpload({
  currentImage,
  userName,
  onImageChange,
  setValue,
}: ProfileImageUploadProps) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("profileImage", file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <UserAvatar
          src={currentImage}
          name={userName}
          size="xl"
        />
        <label
          htmlFor="profileImage"
          className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors"
        >
          <Camera className="w-4 h-4 text-white" />
        </label>
        <input
          id="profileImage"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
      <span className="text-gray-600">Tap to change</span>
    </div>
  );
}