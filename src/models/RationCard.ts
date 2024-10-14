import mongoose, { Schema } from "mongoose";

const RationCardSchema = new Schema({
  rationCardNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v: string) {
        return /^\d{12}$/.test(v);
      },
      message: (props: any) =>
        `${props.value} is not a valid Ration Card number! Ration Card number must be 12 digits.`,
    },
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
