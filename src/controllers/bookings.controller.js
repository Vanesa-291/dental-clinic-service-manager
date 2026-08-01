import BookingsService from '../services/bookings.service.js';

const service = new BookingsService();

export const createBooking = async (req, res) => {
  try {
    const result = await service.createBooking(req.body);
    if (result.error) return res.status(400).json({ error: result.error });

    // Emite evento Socket.io a todos los clientes conectados
    const { io } = await import('../server.js');
    io.emit('nueva_reserva', {
      _id: result._id.toString(), clientName: result.clientName,
      clientEmail: result.clientEmail, date: result.date,
      time: result.time, status: result.status,
    });

    res.status(201).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Ahora devuelve la reserva con populate: cada servicio trae el detalle completo
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
    res.status(200).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
