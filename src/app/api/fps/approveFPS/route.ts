import approvalEmail from "@/middlewares/approvalEmail";
import dbConfig from "@/middlewares/db.config";
import Address from "@/models/Address";
import FairPriceShop from "@/models/FairPriceShop";
import RationCard from "@/models/RationCard";
import Stock from "@/models/Stock";
import Tehsil from "@/models/Tehsil";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function PUT(req: NextRequest) {
  const { fpsId, status } = await req.json();
  const acceptedStatus = status === "Approved";

  // If approved, update the FPS approval status
  const fps = await FairPriceShop.findByIdAndUpdate(
    fpsId,
    { isAdminApproved: acceptedStatus },
    { new: true }
  ).populate("address");

  await fps.save();

  const tehsil = await Tehsil.findOne({ pincode: fps.pincode });
  if (!tehsil) {
    return NextResponse.json(
      {
        message: "Tehsil not found",
      },
      { status: 404 }
    );
  } else {
    tehsil.fpsShopUnder.push(fps._id);
    await tehsil.save();
  }

  // Send approval email if status is approved
  // await approvalEmail(fps.email, fps);

  if (fps) {
    return NextResponse.json(fps);
  }
}
