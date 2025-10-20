import { Control, useWatch } from "react-hook-form";
import type { CreateUserFormData } from "../schemas/userSchema";
import StudentFields from "./role-fields/StudentFields";
import TeacherFields from "./role-fields/TeacherFields";
import ParentFields from "./role-fields/ParentFields";

interface RoleSpecificFieldsProps {
  control: Control<CreateUserFormData>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: any;
}

export default function RoleSpecificFields({ control, register, setValue, errors, watch }: RoleSpecificFieldsProps) {
  const selectedRole = useWatch({ control, name: "role" });

  if (selectedRole === "Student") {
    return <StudentFields register={register} errors={errors} watch={watch} />;
  }

  if (selectedRole === "Teacher") {
    return (
      <TeacherFields
        control={control}
        register={register}
        setValue={setValue}
        errors={errors}
      />
    );
  }

  if (selectedRole === "Parent") {
    return (
      <ParentFields
        control={control}
        register={register}
        setValue={setValue}
        errors={errors}
      />
    );
  }

  return null;
}