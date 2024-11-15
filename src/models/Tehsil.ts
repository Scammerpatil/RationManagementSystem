import mongoose, { Schema } from "mongoose";

const TehsilSchema = new Schema(
  {
    tehsilUserId: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: mongoose.Types.ObjectId,
      ref: "Address",
      required: true,
      unique: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: /^[1-9][0-9]{5}$/,
    },
    taluka: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fpsShopUnder: [
      {
        type: mongoose.Types.ObjectId,
        ref: "FairPriceShop",
      },
    ],
    officers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Officer",
      },
    ],
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
    },
    allocatedStock: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stock",
      },
    ],
    remainingStock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
    },
    transactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    ],
  },
  { timestamps: true }
);

const Tehsil = mongoose.models.Tehsil || mongoose.model("Tehsil", TehsilSchema);
export default Tehsil;
