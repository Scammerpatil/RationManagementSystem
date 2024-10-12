import mongoose, { Schema } from "mongoose";

const OfficerSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    mobileNumber: { type: Number, required: true },
    email: { type: String, required: true },
    post: { type: String, required: true },
  },
  { timestamps: true }
);

const Officer =
  mongoose.models.Officer || mongoose.model("Officer", OfficerSchema);
export default Officer;
