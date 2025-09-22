import { UseFormRegister, FieldErrors } from "react-hook-form";
import { z } from "zod";
import { completeSchoolInfoSchema } from "@/features/admin/dashboard/schema/dashboardSchema";

type SchoolInfoFormData = z.infer<typeof completeSchoolInfoSchema>;

interface SchoolInfoFormFieldsProps {
  register: UseFormRegister<SchoolInfoFormData>;
  errors: FieldErrors<SchoolInfoFormData>;
  isSubmitting: boolean;
}

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa",
  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
  "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe",
  "Zamfara", "FCT"
];

export default function SchoolInfoFormFields({ register, errors, isSubmitting }: SchoolInfoFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* School name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School name *
        </label>
        <input
          type="text"
          {...register("schoolName")}
          placeholder="Enter school name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          disabled={isSubmitting}
        />
        {errors.schoolName && (
          <p className="mt-1 text-sm text-red-600">{errors.schoolName.message}</p>
        )}
      </div>

      {/* School short name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School short name *
        </label>
        <input
          type="text"
          {...register("schoolShortName")}
          placeholder="Enter school short name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          disabled={isSubmitting}
        />
        {errors.schoolShortName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.schoolShortName.message}
          </p>
        )}
      </div>

      {/* School principal */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School principal *
        </label>
        <input
          type="text"
          {...register("schoolPrincipal")}
          placeholder="Enter principal's name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          disabled={isSubmitting}
        />
        {errors.schoolPrincipal && (
          <p className="mt-1 text-sm text-red-600">
            {errors.schoolPrincipal.message}
          </p>
        )}
      </div>

      {/* School type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School type *
        </label>
        <select
          {...register("schoolType")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          disabled={isSubmitting}
        >
          <option value="">Select type</option>
          <option value="primary">Primary School</option>
          <option value="secondary">Secondary School</option>
          <option value="combined">Primary & Secondary</option>
          <option value="nursery">Nursery/Pre-School</option>
          <option value="all">All Levels</option>
        </select>
        {errors.schoolType && (
          <p className="mt-1 text-sm text-red-600">
            {errors.schoolType.message}
          </p>
        )}
      </div>

      {/* School motto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School Motto
        </label>
        <input
          type="text"
          {...register("schoolMotto")}
          placeholder="Enter school motto (optional)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          disabled={isSubmitting}
        />
      </div>

      {/* School address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School address *
        </label>
        <input
          type="text"
          {...register("schoolAddress")}
          placeholder="Enter school address"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          disabled={isSubmitting}
        />
        {errors.schoolAddress && (
          <p className="mt-1 text-sm text-red-600">
            {errors.schoolAddress.message}
          </p>
        )}
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country *
        </label>
        <select
          {...register("country")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          disabled={true}
        >
          <option value="Nigeria">Nigeria</option>
        </select>
        {errors.country && (
          <p className="mt-1 text-sm text-red-600">
            {errors.country.message}
          </p>
        )}
      </div>

      {/* State/Province */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State/Province *
        </label>
        <select
          {...register("state")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          disabled={isSubmitting}
        >
          <option value="">Select state</option>
          {NIGERIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        {errors.state && (
          <p className="mt-1 text-sm text-red-600">
            {errors.state.message}
          </p>
        )}
      </div>

      {/* School URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School URL
        </label>
        <input
          type="text"
          {...register("schoolDomain")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-orange-600"
          readOnly
        />
      </div>

      {/* School website */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School website
        </label>
        <input
          type="text"
          {...register("schoolWebsite")}
          placeholder="www.yourschool.edu.ng (optional)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          disabled={isSubmitting}
        />
        {errors.schoolWebsite && (
          <p className="mt-1 text-sm text-red-600">
            {errors.schoolWebsite.message}
          </p>
        )}
      </div>

      {/* School phone number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School phone number *
        </label>
        <div className="flex">
          <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">
            <span className="text-2xl mr-2">🇳🇬</span>
            <span className="text-gray-700">+234</span>
          </div>
          <input
            type="tel"
            {...register("schoolPhoneNumber")}
            placeholder="801 3567 245"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={isSubmitting}
          />
        </div>
        {errors.schoolPhoneNumber && (
          <p className="mt-1 text-sm text-red-600">
            {errors.schoolPhoneNumber.message}
          </p>
        )}
      </div>

      {/* School email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School email *
        </label>
        <input
          type="email"
          {...register("schoolEmail")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          readOnly
        />
        {errors.schoolEmail && (
          <p className="mt-1 text-sm text-red-600">
            {errors.schoolEmail.message}
          </p>
        )}
      </div>
    </div>
  );
}