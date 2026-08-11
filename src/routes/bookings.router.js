import { Router } from 'express';
import {
  getBookings,
  createBooking,
  getBookingById,
  addServiceToBooking,
  updateServiceQuantity,
  removeServiceFromBooking,
  deleteBooking,
} from '../controllers/bookings.controller.js';
import { validateBody, validateParams } from '../middlewares/validate.middleware.js';
import {
  createBookingSchema,
  addServiceParamsSchema,
  bookingIdParamSchema,
  updateQuantitySchema,
} from '../validators/bookings.validator.js';

const router = Router();

// ─── Sin cambios respecto a la entrega anterior ──────────────────────────
router.post('/',                   validateBody(createBookingSchema), createBooking);
router.get('/:bid',                getBookingById);
router.post('/:bid/services/:sid', validateParams(addServiceParamsSchema), addServiceToBooking);

// ─── 🆕 Nuevas rutas de esta entrega ──────────────────────────────────────
router.get('/',                      getBookings);
router.delete('/:bid',               validateParams(bookingIdParamSchema), deleteBooking);
router.put('/:bid/services/:sid',    validateParams(addServiceParamsSchema), validateBody(updateQuantitySchema), updateServiceQuantity);
router.delete('/:bid/services/:sid', validateParams(addServiceParamsSchema), removeServiceFromBooking);

export default router;
