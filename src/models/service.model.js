import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    description: { type: String, required: true },
    duration:    { type: Number, required: true },
    price:       { type: Number, required: true },
    category:    { type: String, required: true },
    available:   { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
