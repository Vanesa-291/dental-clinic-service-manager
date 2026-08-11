import Service from '../models/service.model.js';

class ServicesDAO {
  async getAll(filter = {}, options = {}) {
    const { skip = 0, limit = 10, sort = {} } = options;
    return await Service.find(filter).sort(sort).skip(skip).limit(limit);
  }

  async count(filter = {}) {
    return await Service.countDocuments(filter);
  }

  async getById(id)      { return await Service.findById(id); }
  async create(data)     { return await new Service(data).save(); }
  async update(id, data) { return await Service.findByIdAndUpdate(id, data, { new: true }); }
  async delete(id)       { return await Service.findByIdAndDelete(id); }
}

export default ServicesDAO;
