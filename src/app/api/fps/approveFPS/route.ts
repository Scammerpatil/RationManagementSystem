import approvalEmail from "@/middlewares/approvalEmail";
import dbConfig from "@/middlewares/db.config";
import Address from "@/models/Address";
import FairPriceShop from "@/models/FairPriceShop";
import RationCard from "@/models/RationCard";
import Stock from "@/models/Stock";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function PUT(req: NextRequest) {
  const { fpsId, status } = await req.json();
  const acceptedStatus = status === "Approved";

  try {
    if (!acceptedStatus) {
      // Deleting the FPS and its related data if not approved
      const fps = await FairPriceShop.findByIdAndDelete(fpsId)
        .populate("address")
        .populate("stock")
        .populate("transactions");

      const address = await Address.findByIdAndDelete(fps?.address._id);
      const stock = await Stock.findByIdAndDelete(fps?.stock._id);
      const transactions = await Transaction.deleteMany({
        _id: { $in: fps?.transactions },
      });

      if (fps) {
        return NextResponse.json(fps);
      } else {
        return NextResponse.json({ message: "Fair Price Shop not found" });
      }
    }

    // If approved, update the FPS approval status
    const fps = await FairPriceShop.findByIdAndUpdate(
      fpsId,
      { isAdminApproved: acceptedStatus },
      { new: true }
    ).populate("address");

    await fps.save();

    const temp = await RationCard.find().populate("address");
    const rationCards = temp.filter(
      (card) => card.address.pincode === fps.address.pincode
    );

    fps.rationUnder = rationCards.map((card) => card._id);
    await fps.save();

    rationCards.forEach(async (card) => {
      card.fpsId = fps._id;
      await card.save();
    });

    // Send approval email if status is approved
    // await approvalEmail(fps.email, fps);

    if (fps) {
      return NextResponse.json(fps);
    }
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
