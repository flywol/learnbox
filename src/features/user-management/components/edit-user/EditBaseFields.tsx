import { UseFormRegister, FieldErrors } from "react-hook-form";

interface EditBaseFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  currentRole: string;
}

export default function EditBaseFields({ register, errors, currentRole }: EditBaseFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          {...register("fullName")}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
            errors.fullName ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.fullName && (
          <p className="text-sm text-red-600 mt-1">{errors.fullName.message as string}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          {...register("email")}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
            errors.email ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message as string}</p>
        )}
      </div>

      {/* Role - Read only for edit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          {...register("role")}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
        >
          <option value={currentRole}>
            {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
          </option>
        </select>
      </div>
    </div>
  );
}