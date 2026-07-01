import { z } from 'zod';

export const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name and lastname is required')
    .max(100, 'Name is too long'),

  phone: z
    .string()
    .trim()
    .min(6, 'Phone is required')
    .max(30, 'Phone is too long'),

  email: z.string().trim().email('Invalid email').max(120, 'Email is too long'),

  message: z
    .string()
    .trim()
    .min(5, 'Message is too short')
    .max(2000, 'Message is too long'),

  consent: z.literal(true, {
    error: 'Consent is required',
  }),
});

export type ContactFormInput = z.infer<typeof ContactSchema>;
