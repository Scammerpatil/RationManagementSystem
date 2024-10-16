import dbConfig from "@/middlewares/db.config";
import Address from "@/models/Address";
import FairPriceShop from "@/models/FairPriceShop";
import Tehsil from "@/models/Tehsil";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  const { tehsilId } = await req.json();
  FairPriceShop;
  Address;
  try {
    const tehsil = await Tehsil.findOne({ tehsilUserId: tehsilId })
      .populate("fpsShopUnder")
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
