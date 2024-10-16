import approvalEmail from "@/middlewares/approvalEmail";
import dbConfig from "@/middlewares/db.config";
import Address from "@/models/Address";
import RationCard from "@/models/RationCard";
import Stock from "@/models/Stock";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function PUT(req: NextRequest) {
  const { rationCardId, status } = await req.json();
  const accpetedStatus = status === "Approved";
  try {
    if (!accpetedStatus) {
      User;
      const rationCard = await RationCard.findByIdAndDelete(rationCardId)
        .populate("head")
        .populate("address")
        .populate("stock")
        .populate("transaction");
      const user = await User.findByIdAndDelete(rationCard.head._id);
      const address = await Address.findByIdAndDelete(rationCard.address._id);
      const stock = await Stock.findByIdAndDelete(rationCard.stock._id);
      const transaction = await Transaction.findByIdAndDelete(
        rationCard.transaction._id
      );
      if (rationCard) {
        return NextResponse.json(rationCard);
      }
    }
    const rationCard = await RationCard.findByIdAndUpdate(
      rationCardId,
      { isAdminApproved: accpetedStatus },
      { new: true }
    ).populate("head");
    await rationCard.save();
    await approvalEmail(rationCard.head.email, rationCard);
    if (rationCard) {
      return NextResponse.json(rationCard);
    }
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
