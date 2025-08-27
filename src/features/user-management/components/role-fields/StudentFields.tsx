import { useState, useEffect } from "react";
import { Gender, ClassLevelData, ClassArmData } from "../../types/user.types";
import { userApiClient } from "../../api/userApiClient";

interface StudentFieldsProps {
  register: any;
  errors: any;
}

export default function StudentFields({ register, errors }: StudentFieldsProps) {
  const [classLevels, setClassLevels] = useState<ClassLevelData[]>([]);
  const [classArms, setClassArms] = useState<ClassArmData[]>([]);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [loadingArms, setLoadingArms] = useState(false);

  const genders: Gender[] = ["Male", "Female"];

  useEffect(() => {
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
  }, []);

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