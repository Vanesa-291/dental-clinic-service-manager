import ServicesService from '../services/services.service.js';

const service = new ServicesService();

// ─── Ahora devuelve { payload, totalItems, totalPages, currentPage, ... } ─
export const getServices = async (req, res) => {
  try {
    const result = await service.getServices(req.query);
    res.status(200).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getServiceById = async (req, res) => {
  try {
    const result = await service.getServiceById(req.params.sid);
    if (!result) return res.status(404).json({ error: `No se encontró el servicio con id "${req.params.sid}".` });
    res.status(200).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const createService = async (req, res) => {
  try {
    const result = await service.createService(req.body);
    if (result.error) return res.status(400).json({ error: result.error });

    // Emite evento Socket.io a todos los clientes conectados
    const { io } = await import('../server.js');
    io.emit('nuevo_servicio', {
      _id: result._id.toString(), name: result.name,
      description: result.description, duration: result.duration,
      price: result.price, category: result.category, available: result.available,
    });

    res.status(201).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateService = async (req, res) => {
  try {
    const result = await service.updateService(req.params.sid, req.body);
    if (!result) return res.status(404).json({ error: `No se encontró el servicio con id "${req.params.sid}".` });
    if (result.error) return res.status(400).json({ error: result.error });
    res.status(200).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteService = async (req, res) => {
  try {
    const result = await service.deleteService(req.params.sid);
    if (!result) return res.status(404).json({ error: `No se encontró el servicio con id "${req.params.sid}".` });
    res.status(200).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
