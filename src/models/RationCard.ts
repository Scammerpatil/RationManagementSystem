import mongoose, { Schema } from "mongoose";

const RationCardSchema = new Schema({
  rationCardNumber: {
    type: String,
    required: true,
    unique: true,
  },
  cardType: {
    type: String,
    enum: ["White", "Saffron", "Yellow"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Suspended", "Canceled"],
    required: true,
    default: "Active",
  },
  head: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  address: {
    type: Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  fpsId: {
    type: Schema.Types.ObjectId,
    ref: "FairPriceShop",
  },
  stock: {
    type: Schema.Types.ObjectId,
    ref: "Stock",
    required: true,
  },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  isAdminApproved: {
    type: Boolean,
    default: false,
  },
});

const RationCard =
  mongoose.models.RationCard || mongoose.model("RationCard", RationCardSchema);
export default RationCard;
