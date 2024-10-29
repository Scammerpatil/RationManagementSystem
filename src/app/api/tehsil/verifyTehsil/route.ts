import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Tehsil from "@/models/Tehsil";
import dbConfig from "@/middlewares/db.config";
import Address from "@/models/Address";
import FairPriceShop from "@/models/FairPriceShop";
import Stock from "@/models/Stock";
import Transaction from "@/models/Transaction";

dbConfig();

export async function GET(req: NextRequest) {
  Address;
  FairPriceShop;
  Transaction;
  Stock;
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  if (!process.env.JWT_SECRET) {
    return NextResponse.json(
      { error: "Server configuration error: JWT_SECRET missing" },
      { status: 500 }
    );
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const tehsil = await Tehsil.findOne({
      tehsilUserId: data.tehsilId as string,
    }).populate("address fpsShopUnder transactions allocatedStock stock");

    if (!tehsil) {
      return NextResponse.json({ error: "Tehsil not found" }, { status: 404 });
    }

    return NextResponse.json({ tehsil });
  } catch (err: any) {
    console.log(err);
    const errorMessage =
      err.name === "JsonWebTokenError"
        ? "Invalid token"
        : "Token verification failed";
    return NextResponse.json({ error: errorMessage }, { status: 403 });
  }
}
