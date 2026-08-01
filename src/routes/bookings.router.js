import { Router } from 'express';
import { createBooking, getBookingById, addServiceToBooking } from '../controllers/bookings.controller.js';
import { validateBody, validateParams } from '../middlewares/validate.middleware.js';
import { createBookingSchema, addServiceParamsSchema } from '../validators/bookings.validator.js';

const router = Router();

router.post('/',                   validateBody(createBookingSchema), createBooking);
router.get('/:bid',                getBookingById);
router.post('/:bid/services/:sid', validateParams(addServiceParamsSchema), addServiceToBooking);

export default router;
