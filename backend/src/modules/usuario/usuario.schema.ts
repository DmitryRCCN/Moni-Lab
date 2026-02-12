import { z } from 'zod';

export const getUserSchema = z.object({
  id: z.string().uuid('ID debe ser un UUID válido'),
});

export const updateUserSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').optional(),
});

export const deleteUserSchema = z.object({
  id: z.string().uuid('ID debe ser un UUID válido'),
});
