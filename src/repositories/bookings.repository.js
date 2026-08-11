import BookingsDAO from '../dao/bookings.dao.js';

const dao = new BookingsDAO();

class BookingsRepository {
  async getAll()               { return await dao.getAll(); }
  async getAllPopulated()      { return await dao.getAllPopulated(); }
  async getById(id)            { return await dao.getById(id); }
  async getByIdPopulated(id)   { return await dao.getByIdPopulated(id); }
  async create(data)           { return await dao.create(data); }
  async update(id, data)       { return await dao.update(id, data); }
  async delete(id)             { return await dao.delete(id); }
}

export default BookingsRepository;
