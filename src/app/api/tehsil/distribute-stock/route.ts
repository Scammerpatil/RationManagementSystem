import Stock from "@/models/Stock";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Tehsil from "@/models/Tehsil";

export async function POST(req: NextRequest) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction(); // Start the transaction

    const { tehsilId } = await req.json();
    const tehsil = await Tehsil.findById(tehsilId).session(session);
    const { stock } = tehsil;
    const date = new Date();

    // Create and save the stock
    const newStock = new Stock({
      month: date.getMonth(),
      stock,
    });
    await newStock.save({ session });

    tehsil.allocatedStock.push(stock);

    // Create and save the transaction
    const newTransaction = new Transaction({
      senderId: "673744c873641516373f63ad",
      senderType: "Admin",
      receiverId: tehsil._id,
      receiverType: "Tehsil",
      stock: newStock._id,
    });
    tehsil.remainingStock = stock;
    await newTransaction.save({ session });
    tehsil.transactions.push(newTransaction._id);
    await tehsil.save({ session });

    await session.commitTransaction();
    session.endSession();
    return NextResponse.json({ message: "Stock distributed successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed: ", error);
    return NextResponse.json(
      { message: "Failed to distribute stock" },
      { status: 500 }
    );
  }
}
