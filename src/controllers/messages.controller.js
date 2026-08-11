import MessagesService from '../services/messages.service.js';
const service = new MessagesService();

export const getMessages = async (req, res) => {
  try { res.status(200).json(await service.getMessages()); }
  catch (err) { res.status(500).json({ error: err.message }); }
};

export const getMessageById = async (req, res) => {
  try {
    const result = await service.getMessageById(req.params.mid);
    if (!result) return res.status(404).json({ error: `No se encontró el mensaje con id "${req.params.mid}".` });
    res.status(200).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const createMessage = async (req, res) => {
  try {
    const result = await service.createMessage(req.body);
    if (result.error) return res.status(400).json({ error: result.error });
    res.status(201).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateMessage = async (req, res) => {
  try {
    const result = await service.updateMessage(req.params.mid, req.body);
    if (!result) return res.status(404).json({ error: `No se encontró el mensaje con id "${req.params.mid}".` });
    res.status(200).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteMessage = async (req, res) => {
  try {
    const result = await service.deleteMessage(req.params.mid);
    if (!result) return res.status(404).json({ error: `No se encontró el mensaje con id "${req.params.mid}".` });
    res.status(200).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
