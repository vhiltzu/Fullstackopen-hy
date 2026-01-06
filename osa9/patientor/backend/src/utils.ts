import { z } from "zod";
import { Entry, Gender, HealthCheckRating } from "./types";

const transformDate = (date: string | undefined) =>
  date ? new Date(date) : undefined;

export const newPatientSchema = z.object({
  name: z.string().trim().min(1, "Name is required"), // Trim whitespace and ensure at least 1 character to avoid empty names
  occupation: z.string().trim().min(1, "Occupation is required"), // Do the same for occupation
  gender: z.enum(Gender),
  ssn: z.string().optional(),
  dateOfBirth: z.string().optional().transform(transformDate), // Transform to Date object if provided due to z.string().date() is now deprecated syntax
});

const baseHealthEntrySchema = z.object({
  description: z.string().min(1, "Description is required"),
  specialist: z.string().min(1, "Specialist is required"),
  date: z.string().min(1, "Date is required").transform(transformDate),
  diagnosticsCodes: z.array(z.string()).optional(),
});

// According the zod documentation we can create a union type schema like this to support more than one type
export const newEntrySchema = z.discriminatedUnion("type", [
  // Hospital entry
  z.object({
    type: z.literal<Entry["type"]>("Hospital"),
    ...baseHealthEntrySchema.shape,
    discharge: z.object({
      date: z
        .string()
        .min(1, "Discharge date is required")
        .transform(transformDate),
      criteria: z.string().min(1, "Discharge criteria is required"),
    }),
  }),

  // OccupationalHealthcare entry
  z.object({
    type: z.literal<Entry["type"]>("OccupationalHealthcare"),
    ...baseHealthEntrySchema.shape,
    employerName: z.string().min(1, "Employer name is required"),
    sickLeave: z
      .object({
        startDate: z
          .string()
          .min(1, "Sick leave start date is required")
          .transform(transformDate),
        endDate: z
          .string()
          .min(1, "Sick leave end date is required")
          .transform(transformDate),
      })
      .optional(),
  }),

  // HealthCheck entry
  z.object({
    type: z.literal<Entry["type"]>("HealthCheck"),
    ...baseHealthEntrySchema.shape,
    healthCheckRating: z.enum(HealthCheckRating),
  }),
]);
