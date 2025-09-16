import { Control, useWatch } from "react-hook-form";
import { Gender } from "../../types/user.types";
import type { CreateUserFormData } from "../../schemas/userSchema";
import ChildSelector from "../ChildSelector";

interface ParentFieldsProps {
  control: Control<CreateUserFormData>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
}

export default function ParentFields({ control, register, setValue, errors }: ParentFieldsProps) {
  const linkedChildren = useWatch({ control, name: "linkedChildren" }) || [];
  const genders: Gender[] = ["Male", "Female"];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Relationship to Student */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Relationship to student *
          </label>
          <input
            type="text"
            {...register("relationshipToStudent")}
            placeholder="Input relationship"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.relationshipToStudent ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.relationshipToStudent && (
            <p className="text-sm text-red-600 mt-1">{errors.relationshipToStudent.message}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender *
          </label>
          <select
            {...register("gender")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.gender ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select gender</option>
            {genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
          {errors.gender && (
            <p className="text-sm text-red-600 mt-1">{errors.gender.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone number *
          </label>
          <input
            type="tel"
            {...register("phoneNumber")}
            placeholder="Enter phone number"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-600 mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>
      </div>

      {/* Linked Children */}
      <ChildSelector
        selectedChildren={linkedChildren}
        onChildrenChange={(children) => setValue("linkedChildren", children)}
        error={errors.linkedChildren?.message}
      />
    </div>
  );
}