import MessagesDAO from '../dao/messages.dao.js';

const dao = new MessagesDAO();

class MessagesRepository {
  async getAll()           { return await dao.getAll(); }
  async getById(id)        { return await dao.getById(id); }
  async create(data)       { return await dao.create(data); }
  async update(id, data)   { return await dao.update(id, data); }
  async delete(id)         { return await dao.delete(id); }
}

export default MessagesRepository;
