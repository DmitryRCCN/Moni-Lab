import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  nombre: z.string().min(2),
});

export const loginSchema = z.object({
  nombre: z.string().min(2),
  password: z.string().min(8),
});

export const requestRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  nombre: z.string().min(2),
});

export const confirmRegistrationSchema = z.object({
  token: z.string().min(1),
});
