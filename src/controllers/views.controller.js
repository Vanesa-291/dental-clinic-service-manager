import ServicesService from '../services/services.service.js';
import BookingsService from '../services/bookings.service.js';

const servicesService = new ServicesService();
const bookingsService = new BookingsService();

export const renderServices = async (req, res) => {
  try {
    // La vista muestra el catálogo completo (limit alto) sin controles de
    // paginación; la paginación real para consumidores programáticos vive
    // en GET /api/services (ver README).
    const { payload } = await servicesService.getServices({ limit: 100 });

    const serviciosPlain = payload.map((s) => ({
      _id:         s._id.toString(),
      name:        s.name,
      description: s.description,
      duration:    s.duration,
      price:       s.price,
      category:    s.category,
      available:   s.available,
    }));

    res.render('services', { title: 'Servicios — DentalClinic', services: serviciosPlain });
  } catch (err) {
    res.status(500).send('Error al cargar los servicios: ' + err.message);
  }
};

export const renderBookings = async (req, res) => {
  try {
    const bookings = await bookingsService.getBookings();
    const reservasPlain = bookings.map((b) => ({
      _id:         b._id.toString(),
      clientName:  b.clientName,
      clientEmail: b.clientEmail,
      date:        b.date,
      time:        b.time,
      status:      b.status,
      services:    b.services.length,
    }));
    res.render('bookings', { title: 'Reservas — DentalClinic', bookings: reservasPlain });
  } catch (err) {
    res.status(500).send('Error al cargar las reservas: ' + err.message);
  }
};
