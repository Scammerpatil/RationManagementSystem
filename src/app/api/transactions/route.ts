// /pages/api/inventory/transactions.ts

import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/models/Transaction";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "UserId is required" }, { status: 400 });
  }

  try {
    // Fetch transactions for the user
    const transactions = await Transaction.find({
      $or: [{ receiverId: userId }, { senderId: userId }],
    })
      .populate("senderId")
      .populate("receiverId")
      .populate("stock");

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Error fetching transactions" },
      { status: 500 }
    );
  }
}
