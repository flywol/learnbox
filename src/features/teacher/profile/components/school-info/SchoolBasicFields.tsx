import { UseFormRegister, FieldErrors } from "react-hook-form";

interface SchoolInfoFormData {
  schoolName: string;
  schoolShortName?: string;
  schoolWebsite?: string;
  schoolPhoneNumber?: string;
  schoolEmail?: string;
  schoolAddress?: string;
  learnboxUrl?: string;
  country?: string;
  state?: string;
  schoolPrincipal?: string;
  schoolMotto?: string;
  schoolType?: string;
  schoolLogo?: string;
  principalSignature?: string;
}

interface SchoolBasicFieldsProps {
  register: UseFormRegister<SchoolInfoFormData>;
  errors: FieldErrors<SchoolInfoFormData>;
}

export default function SchoolBasicFields({ register, errors }: SchoolBasicFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <input
          type="text"
          {...register("schoolName")}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
            errors.schoolName ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="School Name"
        />
        {errors.schoolName && (
          <p className="text-sm text-red-600 mt-1">{errors.schoolName.message as string}</p>
        )}
      </div>

      <div>
        <input
          type="text"
          {...register("schoolShortName")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Short Name"
        />
      </div>

      <div>
        <input
          type="text"
          {...register("schoolPrincipal")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Principal Name"
        />
      </div>

      <div>
        <input
          type="tel"
          {...register("schoolPhoneNumber")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Phone Number"
        />
      </div>

      <div>
        <input
          type="email"
          {...register("schoolEmail")}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
            errors.schoolEmail ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="School Email"
        />
        {errors.schoolEmail && (
          <p className="text-sm text-red-600 mt-1">{errors.schoolEmail.message as string}</p>
        )}
      </div>

      <div>
        <input
          type="url"
          {...register("schoolWebsite")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Website"
        />
      </div>
    </div>
  );
}