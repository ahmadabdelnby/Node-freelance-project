const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  freelancer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  bidAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  deliveryTime: {
    type: Number, // in days
    required: true,
  },
  attachments: [
    {
      url: String,
      fileName: String,
    },
  ],
  status: {
    type: String,
    enum: ['submitted', 'viewed', 'accepted', 'rejected', 'withdrawn'],
    default: 'submitted',
  },
  withdrawReason: {
    type: String,
  },
},  { timestamps: true });


module.exports = mongoose.model('Proposal', proposalSchema);
