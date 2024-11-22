import mongoose, { Schema, Document } from "mongoose";
import { IComplaint } from "@/types/Complaint";
const ComplaintSchema: Schema = new Schema(
  {
    rationCardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RationCard", // Reference to RationCard model
      required: true,
    },
    complaintType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Resolved", "In Progress"],
      default: "Pending",
    },
    tehsilId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tehsil", // Reference to Tehsil model
      required: true,
    },
    filedAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Create the Complaint model
const Complaint =
  mongoose.models.Complaint || mongoose.model<IComplaint>("Complaint", ComplaintSchema);

export default Complaint;
