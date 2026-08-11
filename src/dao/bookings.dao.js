import Booking from '../models/booking.model.js';

class BookingsDAO {
  async getAll()      { return await Booking.find(); }
  async getById(id)   { return await Booking.findById(id); }

  // ─── Trae la reserva con el detalle completo de cada servicio asociado ──
  async getByIdPopulated(id) {
    return await Booking.findById(id).populate('services.service');
  }

  // ─── 🆕 Trae TODAS las reservas con el detalle completo de sus servicios ─
  async getAllPopulated() {
    return await Booking.find().populate('services.service');
  }

  async create(data)       { return await new Booking(data).save(); }
  async update(id, data)   { return await Booking.findByIdAndUpdate(id, data, { new: true }); }
  async delete(id)         { return await Booking.findByIdAndDelete(id); }
}

export default BookingsDAO;
