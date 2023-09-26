import mongoose from "mongoose";

const ticketSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      return Math.random().toString(36).substring(2, 11);
    },
  },
  purchase_datetime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

const ticketModel = mongoose.model("ticket", ticketSchema);

export default ticketModel;
