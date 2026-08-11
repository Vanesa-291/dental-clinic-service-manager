import ServicesDAO from '../dao/services.dao.js';

const dao = new ServicesDAO();

class ServicesRepository {
  async getAll(filter, options) { return await dao.getAll(filter, options); }
  async count(filter)           { return await dao.count(filter); }
  async getById(id)             { return await dao.getById(id); }
  async create(data)            { return await dao.create(data); }
  async update(id, data)        { return await dao.update(id, data); }
  async delete(id)              { return await dao.delete(id); }
}

export default ServicesRepository;
