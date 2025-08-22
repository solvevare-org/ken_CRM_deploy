import { z } from "zod";

export const SignUpSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    method: z.enum(["email", "phone"], {
      message: "Verification method is required",
    }),
    email: z
      .string()
      .email("Please enter a valid email address")
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .regex(/^\d{10,15}$/, "Please enter a valid phone number")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .refine(
    (data) =>
      (data.method === "email" && data.email) ||
      (data.method === "phone" && data.phone),
    {
      message: "Email or phone is required depending on method",
      path: ["method"],
    }
  );

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
