import { Types } from "mongoose";

export type FairPriceShop = {
  _id: Types.ObjectId;
  fpsUserId: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  role: string;
  address: Types.ObjectId; // Reference to Address schema
  pincode: string;
  stock: Types.ObjectId[]; // Array of references to Stock schema
  transactions: Types.ObjectId[]; // Array of references to Transaction schema
  isAdminApproved: boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};
