import { Router } from 'express';
import { renderServices, renderBookings } from '../controllers/views.controller.js';

const router = Router();
router.get('/services', renderServices);
router.get('/bookings', renderBookings);

export default router;
