import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import RationCard from "@/models/RationCard";
import Stock from "@/models/Stock";
import FairPriceShop from "@/models/FairPriceShop";
import Tehsil from "@/models/Tehsil";
import { updateFPSStock } from "@/helper/fpsHelpers";
import { updateTehsilStock } from "@/helper/tehsilStockHelper";
import { ObjectId } from "mongoose";

dbConfig();

export async function DELETE(req: NextRequest) {
  const { member, user } = await req.json();
  const { memberId } = member;
  const { rationCardNumber } = user;

  // Find the ration card
  const rationCard = await RationCard.findOne({ rationCardNumber }).populate(
    "members address stock"
  );

  if (!rationCard) {
    return NextResponse.json(
      { message: "Ration card not found" },
      { status: 404 }
    );
  }

  const memberIndex = rationCard.members.findIndex(
    (m) => m._id.toString() === memberId
  );
  if (memberIndex === -1) {
    return NextResponse.json(
      { message: "Member not found in ration card" },
      { status: 404 }
    );
  }

  // Remove the member from the ration card's members array
  rationCard.members.splice(memberIndex, 1);

  // Update the stock based on the new number of members
  const stockID = rationCard.stock._id;
  await updateStock({
    stockID,
    schemeType: rationCard.scheme,
    totalMembersCount: rationCard.members.length,
  });

  // Find the associated Fair Price Shop (FPS) and Tehsil to update their stocks
  const fps = await FairPriceShop.findOne({
    pincode: rationCard.address.pincode,
  });
  const tehsil = await Tehsil.findOne({ taluka: rationCard.address.taluka });

  // Update the FPS and Tehsil stocks
  if (fps) await updateFPSStock(fps._id);
  if (tehsil) await updateTehsilStock(tehsil._id);

  // Save the updated ration card
  await rationCard.save();

  return NextResponse.json({ message: "Member removed successfully" });
}

// Helper function to update the stock for a given scheme and member count
const updateStock = async ({
  stockID,
  schemeType,
  totalMembersCount,
}: {
  stockID: ObjectId;
  schemeType: "AAY" | "BPL" | "PHH" | "APL" | "AY";
  totalMembersCount: number;
}) => {
  const stock = await Stock.findById(stockID);
  if (!stock) {
    console.error("Stock not found");
    return;
  }

  // Base stock allocations based on scheme type
  const baseStock = {
    AAY: { wheat: 10, rice: 8, bajra: 3, sugar: 2, corn: 2, oil: 1.5 },
    BPL: { wheat: 8, rice: 6, bajra: 2, sugar: 1.5, corn: 1.5, oil: 1 },
    PHH: { wheat: 5, rice: 5, bajra: 2, sugar: 1, corn: 1, oil: 1 },
    APL: { wheat: 3, rice: 3, bajra: 1, sugar: 0.5, corn: 0.5, oil: 0.5 },
    AY: { wheat: 1, rice: 1, bajra: 0.5, sugar: 0.25, corn: 0.25, oil: 0.25 },
  };

  const schemeStock = baseStock[schemeType];

  // Update stock quantities based on remaining members
  Object.keys(schemeStock).forEach((item) => {
    stock[item] = schemeStock[item] * totalMembersCount;
  });

  await stock.save();
};
