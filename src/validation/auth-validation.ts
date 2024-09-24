import { z } from "zod";

const registerUserValidation = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(10, { message: "Username must not exceed 10 characters" })
      .regex(/^[a-zA-Z0-9]+$/, { message: "Username must contain only alphanumeric characters" })
      .min(1, { message: "Username is required" }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(100, { message: "Password must not exceed 100 characters" })
      .regex(/(?=.*[a-z])(?=.*[A-Z])/, {
        message: "Password must contain at least one lowercase and one uppercase letter",
      })
      .min(1, { message: "Password is required" }),
    confirmPassword: z.string().min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm password does not match with password",
  });

const loginUserValidation = z.object({
  username: z.string().max(100, "Username must not exceed 100 characters").min(1, "Username is required"),
  password: z.string().max(100, "Password must not exceed 100 characters").min(1, "Password is required"),
});

export { registerUserValidation, loginUserValidation };
