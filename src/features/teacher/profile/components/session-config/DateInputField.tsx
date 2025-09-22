import { Calendar, X } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface DateInputFieldProps {
  name: string;
  placeholder: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export default function DateInputField({ name, placeholder, register, errors }: DateInputFieldProps) {
  const error = errors[name];

  return (
    <div className="relative">
      <input
        type="text"
        {...register(name)}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
        placeholder={placeholder}
        onFocus={(e) => { e.target.type = 'date'; }}
        onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
        <X className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
        <Calendar className="w-4 h-4 text-gray-400" />
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-1">{error.message as string}</p>
      )}
    </div>
  );
}