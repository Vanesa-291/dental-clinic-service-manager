import BookingsRepository from '../repositories/bookings.repository.js';
import ServicesRepository from '../repositories/services.repository.js';

const bookingsRepository = new BookingsRepository();
const servicesRepository = new ServicesRepository();

class BookingsService {
  async getBookings() {
    return await bookingsRepository.getAll();
  }

  // ─── El formato ya fue validado por Zod antes de llegar acá ─────────────
  async createBooking(data) {
    return await bookingsRepository.create({ ...data, services: [] });
  }

  // ─── Ahora usa populate: trae el detalle completo de cada servicio ──────
  async getBookingById(id) {
    try { return await bookingsRepository.getByIdPopulated(id); } catch { return null; }
  }

  // ─── Regla de negocio: quantity++ si el servicio ya existe en la reserva ─
  // Se mantiene igual a la entrega anterior: usa datos sin popular para
  // manipular las referencias (ObjectId), populate es solo para consultar.
  async addServiceToBooking(bookingId, serviceId) {
    let booking;
    try { booking = await bookingsRepository.getById(bookingId); } catch { return null; }
    if (!booking) return null;

    let service;
    try { service = await servicesRepository.getById(serviceId); } catch { return { error: `No se encontró el servicio con id "${serviceId}".` }; }
    if (!service) return { error: `No se encontró el servicio con id "${serviceId}".` };

    const existing = booking.services.find((s) => s.service.toString() === serviceId.toString());
    let updatedServices;
    if (existing) {
      updatedServices = booking.services.map((s) =>
        s.service.toString() === serviceId.toString()
          ? { ...s.toObject(), quantity: s.quantity + 1 }
          : s.toObject()
      );
    } else {
      updatedServices = [...booking.services.map((s) => s.toObject()), { service: serviceId, quantity: 1 }];
    }

    return await bookingsRepository.update(bookingId, { services: updatedServices });
  }
}

export default BookingsService;
