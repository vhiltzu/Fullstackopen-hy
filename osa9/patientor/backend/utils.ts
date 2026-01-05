import { z } from "zod";
import { Gender } from "./types";

export const newPatientSchema = z.object({
  name: z.string().trim().min(1, "Name is required"), // Trim whitespace and ensure at least 1 character to avoid empty names
  occupation: z.string().trim().min(1, "Occupation is required"), // Do the same for occupation
  gender: z.enum(Gender),
  ssn: z.string().optional(),
  dateOfBirth: z
    .string()
    .optional()
    .transform((date) => (date ? new Date(date) : undefined)), // Transform to Date object if provided due to z.string().date() is now deprecated syntax
});
