import Message from '../models/message.model.js';

class MessagesDAO {
  async getAll()        { return await Message.find(); }
  async getById(id)     { return await Message.findById(id); }
  async create(data)    { return await new Message(data).save(); }
  async update(id, data){ return await Message.findByIdAndUpdate(id, data, { new: true }); }
  async delete(id)      { return await Message.findByIdAndDelete(id); }
}

export default MessagesDAO;
