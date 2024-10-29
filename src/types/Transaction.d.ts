import { Stock } from "./Stock";

export interface Transaction {
  senderId: mongoose.Schema.Types.ObjectId;
  senderType: "Tehsil" | "FairPriceShop";
  receiverId: mongoose.Schema.Types.ObjectId;
  receiverType: "Tehsil" | "FairPriceShop" | "User";
  date: Date;
  stock: Stock;
}
