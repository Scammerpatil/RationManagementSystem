import dbConfig from "@/middlewares/db.config";
import FairPriceShop from "@/models/FairPriceShop";
import RationCard from "@/models/RationCard";
import Stock from "@/models/Stock";
import User from "@/models/User";
import type { RationCard as RationCardType } from "@/types/RationCard";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  const { user, members } = await req.json();
  const rationCard = await RationCard.findOne({
    rationCardNumber: user.rationCardNumber,
  });

  if (!rationCard) {
    return NextResponse.json("Ration card not found", { status: 404 });
  }

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

  const stock = await getInitialStock(
    rationCard,
    rationCard.members.length + 1
  );
  if (stock) {
    rationCard.stock = stock;
  }

  await rationCard.save();
  await updateFPSStock(
    rationCard,
    rationCard.members.length + 1,
    user.rationCardType
  );

  return NextResponse.json("Members added successfully");
}

const getInitialStock = async (
  rationCard: RationCardType,
  familyMembersCount: number
) => {
  const allocatedStock = await Stock.findOne({
    rationCardNumber: rationCard.rationCardNumber,
  });
  if (!allocatedStock) return null;

  allocatedStock.wheat *= familyMembersCount;
  allocatedStock.rice *= familyMembersCount;
  allocatedStock.bajra *= familyMembersCount;
  allocatedStock.sugar *= familyMembersCount;
  allocatedStock.corn *= familyMembersCount;
  allocatedStock.oil *= familyMembersCount;

  allocatedStock.month = new Date().getMonth();
  await allocatedStock.save();

  return allocatedStock;
};

const updateFPSStock = async (
  rationCard: RationCardType,
  totalMember: number,
  rationCardType: "White" | "Saffron" | "Yellow"
) => {
  const fps = await FairPriceShop.findById(rationCard.fpsId);
  if (!fps) return;

  const fpsStock = await Stock.findById(fps.stock);
  if (!fpsStock) return;

  const baseStock = {
    White: {
      wheat: 5,
      rice: 5,
      bajra: 2,
      sugar: 1,
      corn: 1,
      oil: 1,
    },
    Saffron: {
      wheat: 10,
      rice: 10,
      bajra: 4,
      sugar: 2,
      corn: 2,
      oil: 2,
    },
    Yellow: {
      wheat: 15,
      rice: 15,
      bajra: 6,
      sugar: 3,
      corn: 3,
      oil: 3,
    },
  };

  const stock = baseStock[rationCardType];
  (Object.keys(stock) as (keyof typeof stock)[]).forEach((key) => {
    fpsStock[key] += stock[key] * totalMember;
  });

  await fpsStock.save();
};
