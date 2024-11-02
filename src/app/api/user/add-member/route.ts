import { updateFPSStock } from "@/helper/fpsHelpers";
import { updateTehsilStock } from "@/helper/tehsilStockHelper";
import dbConfig from "@/middlewares/db.config";
import Address from "@/models/Address";
import FairPriceShop from "@/models/FairPriceShop";
import RationCard from "@/models/RationCard";
import Stock from "@/models/Stock";
import Tehsil from "@/models/Tehsil";
import User from "@/models/User";
import type { RationCard as RationCardType } from "@/types/RationCard";
import type { Stock as StockType } from "@/types/Stock";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  Address;
  const { user, members } = await req.json();
  const id = await Tehsil.findOne({ taluka: user.taluka });
  const rationCard = await RationCard.findOne({
    rationCardNumber: user.rationCardNumber,
  }).populate("address");

  const fps = await FairPriceShop.findOne({
    pincode: rationCard.address.pincode,
  });

  if (!rationCard) {
    return NextResponse.json("Ration card not found", { status: 404 });
  }

  // Add each new member
  for (const member of members) {
    const {
      fullName,
      gender,
      relationship,
      aadharNumber,
      dob,
      email,
      mobileNumber,
      occupation,
      aadhaarFrontCardUrl,
      aadhaarBackCardUrl,
    } = member;

    const newMember = await User.create({
      fullName,
      gender,
      relationship,
      aadharNumber,
      dob,
      email,
      mobileNumber,
      occupation,
      aadhaarFrontCardUrl,
      aadhaarBackCardUrl,
    });

    rationCard.members.push(newMember);
  }

  // Only update stock for the new members
  const stockID = rationCard.stock._id;
  await updateStock({
    stockID,
    schemeType: rationCard.scheme,
    totalMembersCount: rationCard.members.length,
  });
  await updateFPSStock(fps._id);
  await updateTehsilStock(id._id);
  await rationCard.save();

  return NextResponse.json("Members added successfully");
}

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

  Object.keys(schemeStock).forEach((item) => {
    stock[item] = schemeStock[item] * (totalMembersCount + 1);
  });

  await stock.save();
};
