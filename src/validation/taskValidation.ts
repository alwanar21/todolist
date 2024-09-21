import { z } from "zod";

const createTaskValidation = z.object({
  nama: z
    .string()
    .min(1, { message: "Nama harus memiliki minimal 1 karakter." })
    .max(255, { message: "Nama maksimal 255 karakter." }),
  description: z.string().max(1000, { message: "Deskripsi maksimal 1000 karakter." }).optional(),
  date: z.string().refine(
    (date) => {
      // Regex untuk validasi format YYYY-MM-DD
      return /^\d{4}-\d{2}-\d{2}$/.test(date);
    },
    {
      message: "Date tidak boleh kosong",
    }
  ),
  status: z
    .enum(["PENDING", "DOING", "DONE"])
    .default("DOING")
    .refine((val) => ["PENDING", "DOING", "DONE"].includes(val), {
      message: "Status harus salah satu dari PENDING, DOING, atau DONE.",
    }),
  kelompok: z.enum(["WORK", "PERSONAL", "SHOPPING", "OTHERS"], {
    errorMap: () => ({
      message: "Kelompok harus salah satu dari WORK, PERSONAL, SHOPPING, atau OTHERS.",
    }),
  }),
});

export { createTaskValidation };
