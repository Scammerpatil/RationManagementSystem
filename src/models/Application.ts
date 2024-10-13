import mongoose, { mongo, Schema } from "mongoose";

const ApplicationSchema = new Schema({
  rationCard: {
    type: Schema.Types.ObjectId,
    ref: "RationCard",
    required: true,
  },
  status: {
    type: String,
    enum: ["Success", "Pending", "Reject"],
    default: "Pending",
  },
});

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);
export default Application;
