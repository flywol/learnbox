import z from "zod";

export const completeSchoolInfoSchema = z.object({
    schoolName: z.string().min(1, "School name is required"),
    schoolShortName: z.string().min(1, "School short name is required"),
    schoolPrincipal: z.string().min(1, "Principal name is required"),
    schoolType: z.string().min(1, "Please select school type"),
    schoolMotto: z.string().optional(),
    schoolAddress: z.string().min(1, "School address is required"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State/Province is required"),
    schoolDomain: z.string(), 
    schoolWebsite: z.string().url().optional().or(z.literal("")),
    schoolPhoneNumber: z.string().min(1, "Phone number is required"),
    schoolEmail: z.string().email("Invalid email address"),
});