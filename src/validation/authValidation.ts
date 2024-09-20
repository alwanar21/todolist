import { z } from "zod";

const registerUserValidation = z
  .object({
    username: z
      .string()
      .min(3, "Username harus memiliki minimal 3 karakter")
      .max(20, "Username tidak boleh lebih dari 20 karakter")
      .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh mengandung huruf, angka, dan underscore"),

    password: z
      .string()
      .min(8, "Password harus memiliki minimal 8 karakter")
      .regex(
        /(?=.*[a-z])(?=.*[A-Z])/,
        "Password harus mengandung setidaknya satu huruf kecil dan satu huruf besar"
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password dan konfirmasi password tidak cocok",
  });

const loginUserValidation = z.object({
  username: z
    .string()
    .max(100, "Username tidak boleh lebih dari 100 karakter")
    .min(1, "Username diperlukan"),
  password: z
    .string()
    .max(100, "Password tidak boleh lebih dari 100 karakter")
    .min(1, "Password diperlukan"),
});

export { registerUserValidation, loginUserValidation };
