import { UseFormRegister, FieldErrors, Control, UseFormSetValue, useWatch } from "react-hook-form";
import ClassSelector from "../ClassSelector";
import ClassArmSelector from "../ClassArmSelector";
import SubjectSelector from "../SubjectSelector";

interface EditRoleFieldsProps {
  selectedRole: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control?: Control<any>;
  setValue?: UseFormSetValue<any>;
}

const genders = ["Male", "Female"];
const employmentStatuses = ["Full time", "Part time", "Contract"];

export default function EditRoleFields({ selectedRole, register, errors, control, setValue }: EditRoleFieldsProps) {
  // Watch teacher assignment fields
  const assignedClasses = useWatch({ control, name: "assignedClasses" }) || [];
  const assignedClassArms = useWatch({ control, name: "assignedClassArms" }) || [];
  const assignedSubjects = useWatch({ control, name: "assignedSubjects" }) || [];
  if (selectedRole === "student") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class level</label>
          <input
            type="text"
            {...register("classLevel")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              (errors as any).classLevel ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {(errors as any).classLevel && (
            <p className="text-sm text-red-600 mt-1">{(errors as any).classLevel.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class arm</label>
          <input
            type="text"
            {...register("classArm")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              (errors as any).classArm ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {(errors as any).classArm && (
            <p className="text-sm text-red-600 mt-1">{(errors as any).classArm.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Admission number</label>
          <input
            type="text"
            {...register("admissionNumber")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              (errors as any).admissionNumber ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {(errors as any).admissionNumber && (
            <p className="text-sm text-red-600 mt-1">{(errors as any).admissionNumber.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Parent/guardian name</label>
          <input
            type="text"
            {...register("parentName")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              (errors as any).parentName ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {(errors as any).parentName && (
            <p className="text-sm text-red-600 mt-1">{(errors as any).parentName.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            {...register("gender")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.gender ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            {genders.map((gender) => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
          {errors.gender && (
            <p className="text-sm text-red-600 mt-1">{errors.gender.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
          <input
            type="date"
            {...register("dateOfBirth")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              (errors as any).dateOfBirth ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {(errors as any).dateOfBirth && (
            <p className="text-sm text-red-600 mt-1">{(errors as any).dateOfBirth.message as string}</p>
          )}
        </div>
      </div>
    );
  }

  if (selectedRole === "teacher") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              {...register("gender")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.gender ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {genders.map((gender) => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
            {errors.gender && (
              <p className="text-sm text-red-600 mt-1">{errors.gender.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
            <input
              type="tel"
              {...register("phoneNumber")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                (errors as any).phoneNumber ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {(errors as any).phoneNumber && (
              <p className="text-sm text-red-600 mt-1">{(errors as any).phoneNumber.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment status</label>
            <select
              {...register("employmentStatus")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                (errors as any).employmentStatus ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {employmentStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            {(errors as any).employmentStatus && (
              <p className="text-sm text-red-600 mt-1">{(errors as any).employmentStatus.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
            <input
              type="date"
              {...register("dateOfBirth")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                (errors as any).dateOfBirth ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {(errors as any).dateOfBirth && (
              <p className="text-sm text-red-600 mt-1">{(errors as any).dateOfBirth.message as string}</p>
            )}
          </div>
        </div>

        {/* Assigned Classes - Full width */}
        {setValue && (
          <ClassSelector
            selectedClasses={assignedClasses}
            onClassesChange={(classes) => setValue("assignedClasses", classes)}
            error={(errors as any).assignedClasses?.message}
          />
        )}

        {/* Assigned Class Arms - Full width */}
        {setValue && (
          <ClassArmSelector
            selectedClassArms={assignedClassArms}
            onClassArmsChange={(classArms) => setValue("assignedClassArms", classArms)}
            selectedClasses={assignedClasses}
            error={(errors as any).assignedClassArms?.message}
          />
        )}

        {/* Assigned Subjects - Full width */}
        {setValue && (
          <SubjectSelector
            selectedSubjects={assignedSubjects}
            onSubjectsChange={(subjects) => setValue("assignedSubjects", subjects)}
            selectedClasses={assignedClasses}
            selectedClassArms={assignedClassArms}
            error={(errors as any).assignedSubjects?.message}
          />
        )}
      </div>
    );
  }

  if (selectedRole === "parent") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Relationship to student</label>
          <input
            type="text"
            {...register("relationshipToStudent")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              (errors as any).relationshipToStudent ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {(errors as any).relationshipToStudent && (
            <p className="text-sm text-red-600 mt-1">{(errors as any).relationshipToStudent.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            {...register("gender")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.gender ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            {genders.map((gender) => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
          {errors.gender && (
            <p className="text-sm text-red-600 mt-1">{errors.gender.message as string}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
          <input
            type="tel"
            {...register("phoneNumber")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              (errors as any).phoneNumber ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {(errors as any).phoneNumber && (
            <p className="text-sm text-red-600 mt-1">{(errors as any).phoneNumber.message as string}</p>
          )}
        </div>
      </div>
    );
  }

  return null;
}