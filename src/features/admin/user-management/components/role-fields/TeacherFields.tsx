import { Control, useWatch } from "react-hook-form";
import { EmploymentStatus, Gender } from "../../types/user.types";
import type { CreateUserFormData } from "../../schemas/userSchema";
import SubjectSelector from "../SubjectSelector";
import ClassSelector from "../ClassSelector";
import ClassArmSelector from "../ClassArmSelector";

interface TeacherFieldsProps {
  control: Control<CreateUserFormData>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
}

export default function TeacherFields({ control, register, setValue, errors }: TeacherFieldsProps) {
  const assignedSubjects = useWatch({ control, name: "assignedSubjects" }) || [];
  const assignedClasses = useWatch({ control, name: "assignedClasses" }) || [];
  const assignedClassArms = useWatch({ control, name: "assignedClassArms" }) || [];

  const employmentStatuses: EmploymentStatus[] = ["Full time", "Part time", "Contract"];
  const genders: Gender[] = ["Male", "Female"];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div>
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

        {/* Employment Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employment status *
          </label>
          <select
            {...register("employmentStatus")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.employmentStatus ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select employment status</option>
            {employmentStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {errors.employmentStatus && (
            <p className="text-sm text-red-600 mt-1">{errors.employmentStatus.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of birth *
          </label>
          <input
            type="date"
            {...register("dateOfBirth")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth.message}</p>
          )}
        </div>
      </div>

      {/* Assigned Classes - Full width */}
      <ClassSelector
        selectedClasses={assignedClasses}
        onClassesChange={(classes) => setValue("assignedClasses", classes)}
        error={errors.assignedClasses?.message}
      />

      {/* Assigned Class Arms - Full width */}
      <ClassArmSelector
        selectedClassArms={assignedClassArms}
        onClassArmsChange={(classArms) => setValue("assignedClassArms", classArms)}
        selectedClasses={assignedClasses}
        error={errors.assignedClassArms?.message}
      />

      {/* Assigned Subjects - Full width */}
      <SubjectSelector
        selectedSubjects={assignedSubjects}
        onSubjectsChange={(subjects) => setValue("assignedSubjects", subjects)}
        selectedClasses={assignedClasses}
        selectedClassArms={assignedClassArms}
        error={errors.assignedSubjects?.message}
      />
    </div>
  );
}