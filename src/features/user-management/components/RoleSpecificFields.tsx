import { Control, useWatch } from "react-hook-form";
import type { CreateUserFormData } from "../schemas/userSchema";
import StudentFields from "./role-fields/StudentFields";
import TeacherFields from "./role-fields/TeacherFields";
import ParentFields from "./role-fields/ParentFields";

interface RoleSpecificFieldsProps {
  control: Control<CreateUserFormData>;
  register: any;
  setValue: any;
  errors: any;
}

export default function RoleSpecificFields({ control, register, setValue, errors }: RoleSpecificFieldsProps) {
  const selectedRole = useWatch({ control, name: "role" });

  if (selectedRole === "Student") {
    return <StudentFields register={register} errors={errors} />;
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