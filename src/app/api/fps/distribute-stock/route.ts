import FairPriceShop from "@/models/FairPriceShop";
import Stock from "@/models/Stock";
import Tehsil from "@/models/Tehsil";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { tehsilId, fpsId, requiredStock } = await req.json();

    const tehsil = await Tehsil.findById(tehsilId)
      .session(session)
      .populate("remainingStock");
    const fps = await FairPriceShop.findById(fpsId)
      .session(session)
      .populate("remainingStock");

    if (!tehsil || !fps) {
      throw new Error("Invalid Tehsil or FairPriceShop ID");
    }

    const remainingStockOfTehsil = await Stock.findById(
      tehsil.remainingStock._id
    ).session(session);
    const remainingStockOfFPS = await Stock.findById(
      fps.remainingStock._id
    ).session(session);

    if (!remainingStockOfTehsil || !remainingStockOfFPS) {
      throw new Error("Unable to retrieve stock records");
    }

    // Check stock availability in Tehsil
    const hasEnoughStock =
      remainingStockOfTehsil.wheat >= requiredStock.wheat &&
      remainingStockOfTehsil.rice >= requiredStock.rice &&
      remainingStockOfTehsil.sugar >= requiredStock.sugar &&
      remainingStockOfTehsil.corn >= requiredStock.corn &&
      remainingStockOfTehsil.oil >= requiredStock.oil;

    if (!hasEnoughStock) {
      throw new Error("Insufficient stock in Tehsil");
    }

    // Update Tehsil's remaining stock
    remainingStockOfTehsil.wheat -= requiredStock.wheat;
    remainingStockOfTehsil.rice -= requiredStock.rice;
    remainingStockOfTehsil.sugar -= requiredStock.sugar;
    remainingStockOfTehsil.corn -= requiredStock.corn;
    remainingStockOfTehsil.oil -= requiredStock.oil;
    remainingStockOfTehsil.bajra -= requiredStock.bajra;

    await remainingStockOfTehsil.save({ session });

    // Update FPS's remaining stock
    remainingStockOfFPS.wheat += requiredStock.wheat;
    remainingStockOfFPS.rice += requiredStock.rice;
    remainingStockOfFPS.sugar += requiredStock.sugar;
    remainingStockOfFPS.corn += requiredStock.corn;
    remainingStockOfFPS.oil += requiredStock.oil;
    remainingStockOfFPS.bajra += requiredStock.bajra;

    await remainingStockOfFPS.save({ session });

    // Create new stock entry for this transaction
    const newStock = new Stock({
      month: new Date().getMonth(),
      wheat: requiredStock.wheat,
      rice: requiredStock.rice,
      sugar: requiredStock.sugar,
      corn: requiredStock.corn,
      oil: requiredStock.oil,
      bajra: requiredStock.bajra,
    });

    await newStock.save({ session });

    // Create a transaction record
    const newTransaction = new Transaction({
      senderId: tehsil._id,
      senderType: "Tehsil",
      receiverId: fps._id,
      receiverType: "FairPriceShop",
      stock: newStock._id,
    });

    await newTransaction.save({ session });

    // Update references in Tehsil and FPS
    tehsil.transactions.push(newTransaction._id);
    fps.transactions.push(newTransaction._id);

    await tehsil.save({ session });
    await fps.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({
      message: "Stock distributed successfully",
    });
  } catch (error: any) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();

    console.error("Error during stock distribution:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to distribute stock" },
      { status: 500 }
    );
  }
}
