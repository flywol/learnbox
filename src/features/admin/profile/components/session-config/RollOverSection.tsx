import { UseFormRegister } from "react-hook-form";

interface RollOverSectionProps {
  register: UseFormRegister<any>;
}

export default function RollOverSection({ register }: RollOverSectionProps) {
  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          {...register("rollOverData")}
          className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
        />
        <div>
          <label className="text-sm font-medium text-gray-900">
            Roll over data from previous session
          </label>
          <p className="text-sm text-gray-600 mt-1">
            This will copy students, classes, and other relevant data from the previous session to the new one.
          </p>
        </div>
      </div>
    </div>
  );
}