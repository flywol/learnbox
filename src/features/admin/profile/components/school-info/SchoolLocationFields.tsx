import { UseFormRegister } from "react-hook-form";

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

interface SchoolLocationFieldsProps {
  register: UseFormRegister<SchoolInfoFormData>;
}

export default function SchoolLocationFields({ register }: SchoolLocationFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <input
            type="text"
            {...register("country")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Country"
          />
        </div>

        <div>
          <input
            type="text"
            {...register("state")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="State"
          />
        </div>

        <div>
          <input
            type="text"
            {...register("schoolType")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="School Type"
          />
        </div>
      </div>

      <div>
        <textarea
          {...register("schoolAddress")}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          placeholder="School Address"
        />
      </div>

      <div>
        <input
          type="text"
          {...register("schoolMotto")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="School Motto"
        />
      </div>
    </>
  );
}