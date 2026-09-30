import { z } from 'zod';

export const advisorySchema = z.object({
  cropName: z.string().min(2, {
    message: "Crop name must be at least 2 characters long, or else the soil gods will be displeased and strike your fields with blight.",
  }),
  soilPh: z.coerce.number().min(0, {
    message: "pH cannot be negative unless you're farming in an active volcano or battery acid.",
  }).max(14, {
    message: "pH cannot exceed 14. Even extraterrestrial crystalline moss cannot survive beyond 14.",
  }),
  npk: z.object({
    nitrogen: z.coerce.number().positive({
      message: "Nitrogen must be greater than zero. Soil without nitrogen is merely crushed nihilism.",
    }),
    phosphorus: z.coerce.number().positive({
      message: "Phosphorus must be greater than zero. Plants require ATP to experience agony.",
    }),
    potassium: z.coerce.number().positive({
      message: "Potassium must be greater than zero. Osmotic cellular balance cannot run on good intentions alone.",
    }),
  }),
});

export type AdvisoryInput = z.infer<typeof advisorySchema>;

export const rageClickSchema = z.object({
  elementId: z.string().min(1, { message: "An element must be identified for suffering calibration." }),
  userId: z.string().optional(),
});

export const captchaVerifySchema = z.object({
  solution: z.string(),
  challengeId: z.string(),
});
