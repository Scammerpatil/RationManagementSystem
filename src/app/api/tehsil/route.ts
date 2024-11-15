import dbConfig from "@/middlewares/db.config";
import Tehsil from "@/models/Tehsil";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function GET(req: NextRequest) {
  const tehsils = await Tehsil.find()
    .populate("fpsShopUnder")
    .populate("address")
    .populate("stock")
    .populate("transactions")
    .populate("allocatedStock")
    .populate("remainingStock");
  return NextResponse.json(tehsils);
}
