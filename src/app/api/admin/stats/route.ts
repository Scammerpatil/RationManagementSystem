import dbConfig from "@/middlewares/db.config";
import FairPriceShop from "@/models/FairPriceShop";
import RationCard from "@/models/RationCard";
import Tehsil from "@/models/Tehsil";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function GET(req: NextRequest) {
  const rationCards = await RationCard.find()
    .populate("members")
    .populate("head");
  const tehsils = await Tehsil.find().populate("fpsShopUnder");
  const fps = await FairPriceShop.find().populate("rationUnder");
  const users = await User.find();
  return NextResponse.json({ rationCards, tehsils, fps, users });
}
