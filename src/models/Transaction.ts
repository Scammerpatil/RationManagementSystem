import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "senderType",
  },
  senderType: {
    type: String,
    required: true,
    enum: ["Tehsil", "FairPriceShop", "User"],
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "receiverType",
  },
  receiverType: {
    type: String,
    required: true,
    enum: ["Tehsil", "FairPriceShop", "User"],
  },
  date: {
    type: Date,
    default: new Date(),
  },
  stock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
    required: true,
  },
});

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
export default Transaction;
