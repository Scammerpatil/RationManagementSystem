import { Stock } from "./Stock";

export interface Transaction {
  _id: mongoose.Schema.Types.ObjectId;
  senderId: mongoose.Schema.Types.ObjectId;
  senderType: "Tehsil" | "FairPriceShop";
  receiverId: mongoose.Schema.Types.ObjectId;
  receiverType: "Tehsil" | "FairPriceShop" | "User";
  StockId: mongoose.Schema.Types.ObjectId;
  date: Date;
  stock: Stock;
}
