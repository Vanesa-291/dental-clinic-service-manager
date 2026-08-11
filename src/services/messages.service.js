import MessagesRepository from '../repositories/messages.repository.js';

const repository = new MessagesRepository();
const REQUIRED_FIELDS = ['sender', 'email', 'content'];

class MessagesService {
  async getMessages() {
    return await repository.getAll();
  }

  async getMessageById(id) {
    try { return await repository.getById(id); } catch { return null; }
  }

  async createMessage(data) {
    const missing = REQUIRED_FIELDS.filter((f) => !data[f]);
    if (missing.length > 0) return { error: `Faltan campos obligatorios: ${missing.join(', ')}.` };
    return await repository.create(data);
  }

  async updateMessage(id, data) {
    try {
      const updated = await repository.update(id, data);
      return updated || null;
    } catch { return null; }
  }

  async deleteMessage(id) {
    try {
      const deleted = await repository.delete(id);
      if (!deleted) return null;
      return { message: 'Mensaje eliminado correctamente.', deleted };
    } catch { return null; }
  }
}

export default MessagesService;
