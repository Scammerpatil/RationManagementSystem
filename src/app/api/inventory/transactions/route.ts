import Transaction from "@/models/Transaction";
import FairPriceShop from "@/models/FairPriceShop"; // Import FairPriceShop model
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = req.nextUrl.searchParams;

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    // Find transactions where either senderId or receiverId matches the userId
    const transactions = await Transaction.find({
      $or: [{ receiverId: userId }, { senderId: userId }],
    })
      .populate("senderId") // Populate sender info
      .populate("receiverId") // Populate receiver info
      .populate("stock") // Populate stock info
      .populate({
        path: "senderId", // If the sender is a FairPriceShop, populate that
        match: { senderType: "FairPriceShop" },
        select: "name pincode address", // Select the fields you want from FairPriceShop
      })
      .populate({
        path: "receiverId", // Similarly for receiver if it's a FairPriceShop
        match: { receiverType: "FairPriceShop" },
        select: "name pincode address", // Select the fields you want from FairPriceShop
      });

      
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
