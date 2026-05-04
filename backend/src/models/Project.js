import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['Admin', 'Member'], default: 'Member' }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2 },
  description: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['Active', 'Completed', 'On Hold'], default: 'Active' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [memberSchema]
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
