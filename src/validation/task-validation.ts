import { z } from "zod";

const createTaskValidation = z.object({
  nama: z.string().max(20, "Name must not exceed 20 characters").min(1, "Name is required"),
  description: z.string().max(100, "Description must not exceed 100 characters"),
  date: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: "Date is required",
  }),
  kelompok: z.enum(["WORK", "PERSONAL", "SHOPPING", "OTHERS"], {
    errorMap: () => ({
      message: "Group is required",
    }),
  }),
});

const updateTaskValidation = z.object({
  nama: z.string().min(1, "Name is required").max(255, { message: "Nama maksimal 255 karakter." }),
  description: z.string().min(1, "Description is required").max(1000, { message: "Deskripsi maksimal 1000 karakter." }),
  date: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: "Date is required",
  }),
  kelompok: z.enum(["WORK", "PERSONAL", "SHOPPING", "OTHERS"], {
    errorMap: () => ({
      message: "Group is required",
    }),
  }),
});

const updateStatusTaskValidation = z.object({
  status: z.enum(["PENDING", "DOING", "DONE"], {
    errorMap: () => ({
      message: "Status must be one of PENDING, DOING, DONE",
    }),
  }),
});

export { createTaskValidation, updateTaskValidation, updateStatusTaskValidation };
