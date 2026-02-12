import { z } from 'zod';

export const createLeccionSchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  descripcion: z.string().optional(),
  contenido: z.string().min(10, 'El contenido debe tener al menos 10 caracteres'),
  dificultad: z.enum(['basico', 'intermedio', 'avanzado']).default('basico'),
  orden: z.number().int().positive('El orden debe ser un número positivo'),
});

export const updateLeccionSchema = createLeccionSchema.partial();

export const getLeccionSchema = z.object({
  id: z.string().uuid('ID debe ser un UUID válido'),
});
