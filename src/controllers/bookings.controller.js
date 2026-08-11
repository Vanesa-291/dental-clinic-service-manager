import BookingsService from '../services/bookings.service.js';

const service = new BookingsService();

// ─── 🆕 Lista todas las reservas, con el detalle completo de sus servicios ─
export const getBookings = async (req, res) => {
  try {
    res.status(200).json(await service.getBookings());
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const createBooking = async (req, res) => {
  try {
    const result = await service.createBooking(req.body);
    if (result.error) return res.status(400).json({ error: result.error });

    const { io } = await import('../server.js');
    io.emit('nueva_reserva', {
      _id: result._id.toString(), clientName: result.clientName,
      clientEmail: result.clientEmail, date: result.date,
      time: result.time, status: result.status, services: [],
    });

    res.status(201).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Devuelve la reserva con populate: cada servicio trae el detalle completo
export const getBookingById = async (req, res) => {
  try {
    const result = await service.getBookingById(req.params.bid);
    if (!result) return res.status(404).json({ error: `No se encontró la reserva con id "${req.params.bid}".` });
    res.status(200).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const addServiceToBooking = async (req, res) => {
  try {
    const { bid, sid } = req.params;
    const result = await service.addServiceToBooking(bid, sid);
    if (!result) return res.status(404).json({ error: `No se encontró la reserva con id "${bid}".` });
    if (result.error) return res.status(404).json({ error: result.error });

    // 🆕 Emite la versión poblada para reconstruir la card en vivo;
    // la respuesta HTTP se mantiene exactamente igual que antes.
    const populated = await service.getBookingById(bid);
    const { io } = await import('../server.js');
    io.emit('reserva_actualizada', populated);

    res.status(200).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ─── 🆕 Actualiza la cantidad de un servicio dentro de una reserva ─────────
export const updateServiceQuantity = async (req, res) => {
  try {
    const { bid, sid } = req.params;
    const { quantity } = req.body;
    const result = await service.updateServiceQuantity(bid, sid, quantity);
    if (!result) return res.status(404).json({ error: `No se encontró la reserva con id "${bid}".` });
    if (result.error) return res.status(404).json({ error: result.error });

    const populated = await service.getBookingById(bid);
    const { io } = await import('../server.js');
    io.emit('reserva_actualizada', populated);

    res.status(200).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ─── 🆕 Quita un servicio de una reserva (la reserva sigue existiendo) ─────
export const removeServiceFromBooking = async (req, res) => {
  try {
    const { bid, sid } = req.params;
    const result = await service.removeServiceFromBooking(bid, sid);
    if (!result) return res.status(404).json({ error: `No se encontró la reserva con id "${bid}".` });
    if (result.error) return res.status(404).json({ error: result.error });

    const populated = await service.getBookingById(bid);
    const { io } = await import('../server.js');
    io.emit('reserva_actualizada', populated);

    res.status(200).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ─── 🆕 Elimina la reserva completa ────────────────────────────────────────
export const deleteBooking = async (req, res) => {
  try {
    const { bid } = req.params;
    const result = await service.deleteBooking(bid);
    if (!result) return res.status(404).json({ error: `No se encontró la reserva con id "${bid}".` });

    const { io } = await import('../server.js');
    io.emit('reserva_eliminada', { _id: bid });

    res.status(200).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
