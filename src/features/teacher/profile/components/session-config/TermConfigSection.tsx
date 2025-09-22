import { UseFormRegister, FieldErrors } from "react-hook-form";
import TextInputField from "./TextInputField";
import DateInputField from "./DateInputField";

interface TermConfigSectionProps {
  termNumber: "first" | "second" | "third";
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export default function TermConfigSection({ termNumber, register, errors }: TermConfigSectionProps) {
  const termLabel = termNumber.charAt(0).toUpperCase() + termNumber.slice(1);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <TextInputField
        name={`${termNumber}TermName`}
        placeholder={`${termLabel} Term`}
        register={register}
        errors={errors}
      />
      
      <DateInputField
        name={`${termNumber}TermStartDate`}
        placeholder={`${termLabel} term start date *`}
        register={register}
        errors={errors}
      />
      
      <DateInputField
        name={`${termNumber}TermEndDate`}
        placeholder={`${termLabel} term end date *`}
        register={register}
        errors={errors}
      />
    </div>
  );
}