import { UseFormRegister, FieldErrors } from "react-hook-form";

interface TextInputFieldProps {
  name: string;
  placeholder: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export default function TextInputField({ name, placeholder, register, errors }: TextInputFieldProps) {
  const error = errors[name];

  return (
    <div>
      <input
        type="text"
        {...register(name)}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
        placeholder={placeholder}
      />
      {error && (
        <p className="text-xs text-red-600 mt-1">{error.message as string}</p>
      )}
    </div>
  );
}