import { ObjectId } from "mongoose";

export interface FairPriceShop {
  _id: ObjectId;
  fpsUserId: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  role: "fps" | string;
  address: ObjectId;
  pincode: string;
  rationUnder: ObjectId[];
  stock: ObjectId;
  remainingStock: ObjectId;
  transactions: ObjectId[];
  isAdminApproved: boolean;
  password: string;
}
