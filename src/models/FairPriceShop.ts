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
        // unique: true,
      },
    ],
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
    },
    remainingStock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
    },
    previousStock: [
      {
        month: {
          type: String,
          required: true,
        },
        year: {
          type: Number,
          required: true,
        },
        stockReceived: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Stock",
        },
        stockDistributed: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Stock",
        },
        remainingStock: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Stock",
          required: true,
        },
      },
    ],
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
