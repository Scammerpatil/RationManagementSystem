import dbConfig from "@/middlewares/db.config";
import FairPriceShop from "@/models/FairPriceShop";
import RationCard from "@/models/RationCard";
import Stock from "@/models/Stock";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

dbConfig();

export async function POST(req: NextRequest) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { fpsId, rationCardId, requiredStock } = await req.json();

    const fps = await FairPriceShop.findById(fpsId)
      .populate("stock")
      .session(session);
    if (!fps) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message: "FPS not found" }, { status: 404 });
    }

    const fpsStock = await Stock.findById(fps.remainingStock._id).session(
      session
    );
    if (
      requiredStock.wheat > fpsStock.wheat ||
      requiredStock.rice > fpsStock.rice ||
      requiredStock.sugar > fpsStock.sugar ||
      requiredStock.oil > fpsStock.oil ||
      requiredStock.corn > fpsStock.corn ||
      requiredStock.bajra > fpsStock.bajra
    ) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "Not enough stock in FPS" },
        { status: 400 }
      );
    }

    const rationCard = await RationCard.findById(rationCardId)
      .populate("stock")
      .session(session);
    if (!rationCard) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "Ration Card not found" },
        { status: 404 }
      );
    }

    // Deduct from FPS stock
    fpsStock.wheat -= requiredStock.wheat;
    fpsStock.rice -= requiredStock.rice;
    fpsStock.sugar -= requiredStock.sugar;
    fpsStock.oil -= requiredStock.oil;
    fpsStock.corn -= requiredStock.corn;
    fpsStock.bajra -= requiredStock.bajra;

    const newStock = new Stock({
      month: new Date().getMonth(),
      requiredStock,
    });
    await newStock.save({ session });

    rationCard.monthlyStockRecords.push(newStock._id);
    // Create new transaction
    const newTransaction = new Transaction({
      senderId: fpsId,
      senderType: "FairPriceShop",
      receiverId: rationCardId,
      receiverType: "User",
      stock: newStock._id,
    });
    await newTransaction.save({ session });

    // Update FPS and Ration Card transactions
    rationCard.transactions.push(newTransaction._id);
    fps.transactions.push(newTransaction._id);

    // Save updated stocks and entities
    await fpsStock.save({ session });
    await rationCard.save({ session });
    await fps.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      { message: "Stock distributed successfully" },
      { status: 200 }
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error distributing stock:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
