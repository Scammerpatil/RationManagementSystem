import { ObjectId } from "mongoose";
import { RationCard } from "./RationCard";

export interface FairPriceShop {
  _id: ObjectId;
  fpsUserId: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  role: "fps" | string;
  address: ObjectId;
  pincode: string;
  rationUnder: RationCard[];
  stock: Stock;
  remainingStock: Stock;
  transactions: ObjectId[];
  isAdminApproved: boolean;
  password: string;
}
