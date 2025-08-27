import { z } from "zod";

export const clientSignUpSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    birthday: z.string().optional(),
    preferred_contact_method: z.enum(["email", "phone", "text"]),
    budget_range: z.object({
      min: z.string().optional(),
      max: z.string().optional(),
    }),
    preferred_locations: z.array(z.string()).optional(),
    property_type_interest: z.array(z.string()).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ClientSignUpSchema = z.infer<typeof clientSignUpSchema>;
