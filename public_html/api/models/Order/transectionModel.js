const mongoose = require('mongoose');
const Schema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    transectionId: {
      type: String,
      default: null,
    },
    paymentObject: {
      type: Object,
      default: null,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Transection',Schema)
