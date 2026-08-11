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
    const [bookings, { payload: catalog }] = await Promise.all([
      bookingsService.getBookings(),          // ahora viene con populate
      servicesService.getServices({ limit: 100 }),
    ]);

    const bookingsPlain = bookings.map((b) => ({
      _id:         b._id.toString(),
      clientName:  b.clientName,
      clientEmail: b.clientEmail,
      date:        b.date,
      time:        b.time,
      status:      b.status,
      services: b.services
        // Si un servicio referenciado fue borrado del catálogo, populate
        // devuelve null en ese lugar: lo descartamos para no romper la vista.
        .filter((s) => s.service)
        .map((s) => ({
          quantity: s.quantity,
          service: {
            _id:   s.service._id.toString(),
            name:  s.service.name,
            price: s.service.price,
          },
        })),
    }));

    const catalogPlain = catalog.map((s) => ({
      _id: s._id.toString(), name: s.name, price: s.price,
    }));

    res.render('bookings', {
      title: 'Reservas — DentalClinic',
      bookings: bookingsPlain,
      catalog: catalogPlain,
    });
  } catch (err) {
    res.status(500).send('Error al cargar las reservas: ' + err.message);
  }
};
