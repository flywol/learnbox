import { useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";
import { z } from "zod";
import { profileApiClient } from "@/features/profile/api/profileApiClient";
import { completeSchoolInfoSchema } from "@/features/dashboard/schema/dashboardSchema";

type SchoolInfoFormData = z.infer<typeof completeSchoolInfoSchema>;

interface UseSchoolDataLoaderProps {
  setValue: UseFormSetValue<SchoolInfoFormData>;
  schoolInfo: any;
  authSchoolDomain: string | null;
  user: any;
  signupData: any;
  updateSchoolInfo: (data: any) => void;
}

export function useSchoolDataLoader({
  setValue,
  schoolInfo,
  authSchoolDomain,
  user,
  signupData,
  updateSchoolInfo
}: UseSchoolDataLoaderProps) {
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        const adminProfile = await profileApiClient.getAdminProfile();
        
        const fieldMappings = [
          { backend: adminProfile.school?.schoolName, field: 'schoolName' as const },
          { backend: adminProfile.school?.schoolShortName, field: 'schoolShortName' as const },
          { backend: adminProfile.school?.schoolAddress, field: 'schoolAddress' as const },
          { backend: adminProfile.school?.schoolWebsite, field: 'schoolWebsite' as const },
          { backend: adminProfile.school?.schoolPhoneNumber, field: 'schoolPhoneNumber' as const },
          { backend: adminProfile.school?.schoolEmail, field: 'schoolEmail' as const },
          { backend: adminProfile.school?.country, field: 'country' as const },
          { backend: adminProfile.school?.state, field: 'state' as const },
          { backend: adminProfile.school?.schoolType, field: 'schoolType' as const },
          { backend: adminProfile.school?.schoolMotto, field: 'schoolMotto' as const },
          { backend: adminProfile.school?.schoolPrincipal, field: 'schoolPrincipal' as const },
        ];

        fieldMappings.forEach(({ backend, field }) => {
          if (backend) {
            setValue(field, backend);
            updateSchoolInfo({ [field]: backend });
          }
        });

        if (adminProfile.school?.learnboxUrl) {
          setValue("schoolDomain", adminProfile.school.learnboxUrl);
          updateSchoolInfo({ learnboxUrl: adminProfile.school.learnboxUrl });
        }
      } catch (error) {
        // Backend call failed, fall back to existing logic
      }
      
      // Set school domain from auth store or signup data if not already set from backend
      if (!schoolInfo.learnboxUrl) {
        const domainToUse = authSchoolDomain || signupData?.learnboxUrl;
        if (domainToUse) {
          setValue("schoolDomain", domainToUse);
          updateSchoolInfo({ learnboxUrl: domainToUse });
        }
      }

      // Pre-fill from signup data if fields are still empty
      if (signupData) {
        const signupMappings = [
          { signup: signupData.schoolName, field: 'schoolName' as const, storeField: 'schoolName' },
          { signup: signupData.schoolShortName, field: 'schoolShortName' as const, storeField: 'schoolShortName' },
          { signup: signupData.schoolWebsite, field: 'schoolWebsite' as const, storeField: 'schoolWebsite' },
        ];

        signupMappings.forEach(({ signup, field, storeField }) => {
          if (signup && !schoolInfo[storeField]) {
            setValue(field, signup);
          }
        });
      }

      // Set principal name if not already set
      if (!schoolInfo.schoolPrincipal) {
        const principalName = signupData?.fullName || user?.fullName;
        if (principalName) {
          setValue("schoolPrincipal", principalName);
        }
      }

      // Set contact info if not already set
      if (!schoolInfo.schoolPhoneNumber) {
        const phoneNumber = signupData?.phoneNumber || user?.phoneNumber;
        if (phoneNumber) {
          setValue("schoolPhoneNumber", phoneNumber);
        }
      }

      // Set email if not already set
      if (!schoolInfo.schoolEmail) {
        const email = signupData?.email || user?.email;
        if (email) {
          setValue("schoolEmail", email);
        }
      }
    };

    loadBackendData();
  }, [setValue, schoolInfo, authSchoolDomain, user, signupData, updateSchoolInfo]);
}