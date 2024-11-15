import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const transactions = await Transaction.find({
    $or: [{ receiverId: userId }, { senderId: userId }],
  })
    .populate("senderId")
    .populate("receiverId")
    .populate("stock");
  return NextResponse.json(transactions);
}
