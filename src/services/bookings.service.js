import BookingsRepository from '../repositories/bookings.repository.js';
import ServicesRepository from '../repositories/services.repository.js';

const bookingsRepository = new BookingsRepository();
const servicesRepository = new ServicesRepository();

class BookingsService {
  // ─── 🆕 Ahora devuelve la lista completa CON populate (antes era cruda) ──
  // Único consumidor previo era la vista, que solo usaba .services.length,
  // así que este cambio es seguro y además habilita mostrar el detalle
  // completo de los servicios en la vista de reservas.
  async getBookings() {
    return await bookingsRepository.getAllPopulated();
  }

  // ─── Sin cambios respecto a la entrega anterior ──────────────────────────
  async createBooking(data) {
    return await bookingsRepository.create({ ...data, services: [] });
  }

  async getBookingById(id) {
    try { return await bookingsRepository.getByIdPopulated(id); } catch { return null; }
  }

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

  // ─── 🆕 Actualiza la cantidad de un servicio ya asociado a una reserva ───
  async updateServiceQuantity(bookingId, serviceId, quantity) {
    let booking;
    try { booking = await bookingsRepository.getById(bookingId); } catch { return null; }
    if (!booking) return null;

    const exists = booking.services.some((s) => s.service.toString() === serviceId.toString());
    if (!exists) {
      return { error: `El servicio con id "${serviceId}" no está asociado a esta reserva.` };
    }

    const updatedServices = booking.services.map((s) =>
      s.service.toString() === serviceId.toString()
        ? { ...s.toObject(), quantity }
        : s.toObject()
    );

    return await bookingsRepository.update(bookingId, { services: updatedServices });
  }

  // ─── 🆕 Quita un servicio puntual de una reserva (la reserva persiste) ───
  async removeServiceFromBooking(bookingId, serviceId) {
    let booking;
    try { booking = await bookingsRepository.getById(bookingId); } catch { return null; }
    if (!booking) return null;

    const exists = booking.services.some((s) => s.service.toString() === serviceId.toString());
    if (!exists) {
      return { error: `El servicio con id "${serviceId}" no está asociado a esta reserva.` };
    }

    const updatedServices = booking.services
      .filter((s) => s.service.toString() !== serviceId.toString())
      .map((s) => s.toObject());

    return await bookingsRepository.update(bookingId, { services: updatedServices });
  }

  // ─── 🆕 Elimina la reserva completa ──────────────────────────────────────
  async deleteBooking(bookingId) {
    try {
      const deleted = await bookingsRepository.delete(bookingId);
      if (!deleted) return null;
      return { message: `La reserva de "${deleted.clientName}" fue eliminada correctamente.`, deleted };
    } catch { return null; }
  }
}

export default BookingsService;
