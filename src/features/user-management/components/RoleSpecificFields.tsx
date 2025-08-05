import { useState, useEffect } from "react";
import { Control, useWatch } from "react-hook-form";
import { EmploymentStatus, Gender, ClassLevelData, ClassArmData } from "../types/user.types";
import type { CreateUserFormData } from "../schemas/userSchema";
import SubjectSelector from "./SubjectSelector";
import ChildSelector from "./ChildSelector";
import ClassSelector from "./ClassSelector";
import ClassArmSelector from "./ClassArmSelector";
import { userApiClient } from "../api/userApiClient";

interface RoleSpecificFieldsProps {
  control: Control<CreateUserFormData>;
  register: any;
  setValue: any;
  errors: any;
}

export default function RoleSpecificFields({ control, register, setValue, errors }: RoleSpecificFieldsProps) {
  const selectedRole = useWatch({ control, name: "role" });
  const assignedSubjects = useWatch({ control, name: "assignedSubjects" }) || [];
  const assignedClasses = useWatch({ control, name: "assignedClasses" }) || [];
  const assignedClassArms = useWatch({ control, name: "assignedClassArms" }) || [];
  const linkedChildren = useWatch({ control, name: "linkedChildren" }) || [];


  const [classLevels, setClassLevels] = useState<ClassLevelData[]>([]);
  const [classArms, setClassArms] = useState<ClassArmData[]>([]);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [loadingArms, setLoadingArms] = useState(false);

  const employmentStatuses: EmploymentStatus[] = ["Full time", "Part time", "Contract"];
  const genders: Gender[] = ["Male", "Female"];

  useEffect(() => {
    if (selectedRole === "Student") {
      // Fetch class levels
      const fetchClassLevels = async () => {
        setLoadingLevels(true);
        try {
          const levels = await userApiClient.getClassLevels();
          setClassLevels(Array.isArray(levels) ? levels : []);
        } catch (error) {
          console.error("Failed to fetch class levels:", error);
          setClassLevels([]);
        } finally {
          setLoadingLevels(false);
        }
      };

      // Fetch class arms
      const fetchClassArms = async () => {
        setLoadingArms(true);
        try {
          const arms = await userApiClient.getClassArms();
          setClassArms(Array.isArray(arms) ? arms : []);
        } catch (error) {
          console.error("Failed to fetch class arms:", error);
          setClassArms([]);
        } finally {
          setLoadingArms(false);
        }
      };

      fetchClassLevels();
      fetchClassArms();
    } else {
      // Reset state when role changes away from Student
      setClassLevels([]);
      setClassArms([]);
      setLoadingLevels(false);
      setLoadingArms(false);
    }
  }, [selectedRole]);

  if (selectedRole === "Student") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Class Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class level *
          </label>
          {loadingLevels ? (
            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
              Loading class levels...
            </div>
          ) : classLevels && classLevels.length > 0 ? (
            <select
              {...register("classLevel")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.classLevel ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select class level</option>
              {classLevels.map((level) => (
                <option key={level.id} value={level.class}>
                  {level.class}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              {...register("classLevel")}
              placeholder="Enter class level"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.classLevel ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          )}
          {errors.classLevel && (
            <p className="text-sm text-red-600 mt-1">{errors.classLevel.message}</p>
          )}
        </div>

        {/* Class Arm */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class arm *
          </label>
          {loadingArms ? (
            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
              Loading class arms...
            </div>
          ) : classArms && classArms.length > 0 ? (
            <select
              {...register("classArm")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.classArm ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select class arm</option>
              {classArms.map((arm) => (
                <option key={arm.id} value={arm.armName}>
                  {arm.armName}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              {...register("classArm")}
              placeholder="Enter class arm"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.classArm ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          )}
          {errors.classArm && (
            <p className="text-sm text-red-600 mt-1">{errors.classArm.message}</p>
          )}
        </div>

        {/* Admission Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Admission number *
          </label>
          <input
            type="text"
            {...register("admissionNumber")}
            placeholder="Enter admission number"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.admissionNumber ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.admissionNumber && (
            <p className="text-sm text-red-600 mt-1">{errors.admissionNumber.message}</p>
          )}
        </div>

        {/* Parent/Guardian Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent/guardian name *
          </label>
          <input
            type="text"
            {...register("parentGuardianName")}
            placeholder="Enter parent/guardian name"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.parentGuardianName ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.parentGuardianName && (
            <p className="text-sm text-red-600 mt-1">{errors.parentGuardianName.message}</p>
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
    );
  }

  if (selectedRole === "Teacher") {
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

        {/* Multi-select components side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Assigned Classes */}
          <ClassSelector
            selectedClasses={assignedClasses}
            onClassesChange={(classes) => setValue("assignedClasses", classes)}
            error={errors.assignedClasses?.message}
          />

          {/* Assigned Subjects */}
          <SubjectSelector
            selectedSubjects={assignedSubjects}
            onSubjectsChange={(subjects) => setValue("assignedSubjects", subjects)}
            error={errors.assignedSubjects?.message}
          />
        </div>

        {/* Assigned Class Arms - Full width */}
        <ClassArmSelector
          selectedClassArms={assignedClassArms}
          onClassArmsChange={(classArms) => setValue("assignedClassArms", classArms)}
          error={errors.assignedClassArms?.message}
        />
      </div>
    );
  }

  if (selectedRole === "Parent") {
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

  return null;
}