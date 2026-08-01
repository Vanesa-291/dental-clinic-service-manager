import { z } from 'zod';

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

// ─── Esquema para validar los :params de agregar servicio a una reserva ──
// Verifica que bid y sid tengan formato de ObjectId válido de MongoDB
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const addServiceParamsSchema = z.object({
  bid: z.string().regex(objectIdRegex, 'El id de la reserva no tiene un formato válido.'),
  sid: z.string().regex(objectIdRegex, 'El id del servicio no tiene un formato válido.'),
});
