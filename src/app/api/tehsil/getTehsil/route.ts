import dbConfig from "@/middlewares/db.config";
import Address from "@/models/Address";
import FairPriceShop from "@/models/FairPriceShop";
import RationCard from "@/models/RationCard";
import Tehsil from "@/models/Tehsil";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  const { tehsilId } = await req.json();
  FairPriceShop;
  RationCard;
  User;
  Address;
  try {
    const tehsil = await Tehsil.findOne({ tehsilUserId: tehsilId })
      .populate("fpsShopUnder")
      .populate({
        path: "fpsShopUnder",
        populate: [
          { path: "stock" },
          { path: "address" },
          { path: "remainingStock" },
          {
            path: "rationUnder",
            populate: [
              // { path: "remainingStock" },
              { path: "members" },
              { path: "stock" },
              { path: "head" },
              { path: "address" },
            ],
          },
        ],
      })
      .populate("address");

    if (tehsil) {
      return NextResponse.json(tehsil);
    } else {
      return NextResponse.json({ message: "Tehsil not found" });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
