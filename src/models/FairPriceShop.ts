import mongoose, { Schema } from "mongoose";

const FairPriceShopSchema = new Schema(
  {
    fpsUserId: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      default: "fps",
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    pincode: {
      type: String,
      required: true,
      unique: true,
    },
    rationUnder: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RationCard",
      },
    ],
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
    },
    remainingStock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
    isAdminApproved: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const FairPriceShop =
  mongoose.models.FairPriceShop ||
  mongoose.model("FairPriceShop", FairPriceShopSchema);
export default FairPriceShop;
