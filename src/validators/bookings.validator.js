import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// ─── Esquema para crear una reserva ────────────────────────────────────────
export const createBookingSchema = z.object({
  clientName: z
    .string({ required_error: 'El nombre del cliente es obligatorio.' })
    .min(1, 'El nombre del cliente no puede estar vacío.'),
  clientEmail: z
    .string({ required_error: 'El email es obligatorio.' })
    .email('El email no tiene un formato válido.'),
  date: z
    .string({ required_error: 'La fecha es obligatoria.' })
    .min(1, 'La fecha no puede estar vacía.'),
  time: z
    .string({ required_error: 'La hora es obligatoria.' })
    .min(1, 'La hora no puede estar vacía.'),
  status: z
    .string({ required_error: 'El estado es obligatorio.' })
    .min(1, 'El estado no puede estar vacío.'),
});

// ─── Esquema para validar los :params de agregar/quitar/actualizar servicio ─
export const addServiceParamsSchema = z.object({
  bid: z.string().regex(objectIdRegex, 'El id de la reserva no tiene un formato válido.'),
  sid: z.string().regex(objectIdRegex, 'El id del servicio no tiene un formato válido.'),
});

// ─── 🆕 Esquema para validar solo :bid (eliminar una reserva completa) ─────
export const bookingIdParamSchema = z.object({
  bid: z.string().regex(objectIdRegex, 'El id de la reserva no tiene un formato válido.'),
});

// ─── 🆕 Esquema para actualizar la cantidad de un servicio en una reserva ──
export const updateQuantitySchema = z.object({
  quantity: z
    .number({
      required_error: 'La cantidad es obligatoria.',
      invalid_type_error: 'La cantidad debe ser un número.',
    })
    .int('La cantidad debe ser un número entero.')
    .positive('La cantidad debe ser mayor a 0. Para llegar a 0, usá el endpoint de eliminar servicio de la reserva.'),
});
