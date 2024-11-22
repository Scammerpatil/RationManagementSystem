import mongoose, { Document } from "mongoose";

// Define the Complaint interface
export interface IComplaint extends Document {
  _id:string,
  rationCardId: mongoose.Schema.Types.ObjectId; // Reference to the RationCard filing the complaint
  complaintType: string;
  description: string;
  status: "Pending" | "Resolved" | "In Progress";
  tehsilId: mongoose.Schema.Types.ObjectId; // Reference to Tehsil associated with the complaint
  filedAt: Date;
  resolvedAt?: Date;
}
