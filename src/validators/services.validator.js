import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio.' })
    .min(1, 'El nombre no puede estar vacío.'),
  description: z
    .string({ required_error: 'La descripción es obligatoria.' })
    .min(1, 'La descripción no puede estar vacía.'),
  duration: z
    .number({
      required_error: 'La duración es obligatoria.',
      invalid_type_error: 'La duración debe ser un número.',
    })
    .positive('La duración debe ser mayor a 0.'),
  price: z
    .number({
      required_error: 'El precio es obligatorio.',
      invalid_type_error: 'El precio debe ser un número.',
    })
    .nonnegative('El precio no puede ser negativo.'),
  category: z
    .string({ required_error: 'La categoría es obligatoria.' })
    .min(1, 'La categoría no puede estar vacía.'),
  available: z.boolean({
    required_error: 'available es obligatorio.',
    invalid_type_error: 'available debe ser true o false.',
  }),
});

export const updateServiceSchema = z
  .object({
    name:        z.string().min(1, 'El nombre no puede estar vacío.').optional(),
    description: z.string().min(1, 'La descripción no puede estar vacía.').optional(),
    duration:    z.number({ invalid_type_error: 'La duración debe ser un número.' }).positive('La duración debe ser mayor a 0.').optional(),
    price:       z.number({ invalid_type_error: 'El precio debe ser un número.' }).nonnegative('El precio no puede ser negativo.').optional(),
    category:    z.string().min(1, 'La categoría no puede estar vacía.').optional(),
    available:   z.boolean({ invalid_type_error: 'available debe ser true o false.' }).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debés enviar al menos un campo para actualizar.',
  });
