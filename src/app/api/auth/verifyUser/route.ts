import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import RationCard from "@/models/RationCard";
import User from "@/models/User";
import Address from "@/models/Address";
import Stock from "@/models/Stock";
import FairPriceShop from "@/models/FairPriceShop";

export async function GET(req: NextRequest) {
  User;
  Address;
  Stock;
  FairPriceShop;
  var token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No token found" });
  }
  try {
    var user = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & {
      rationCardId: string;
    };
    const rationCard = await RationCard.findOne({
      _id: user.rationCardId,
    })
      .populate("address")
      .populate("stock")
      .populate("members")
      .populate("head")
      .populate("fpsId")
      .populate("monthlyStockRecords");
    if (!rationCard) {
      return NextResponse.json({ error: "No ration card found" });
    }
    return NextResponse.json({ user, rationCard });
  } catch (err) {
    return NextResponse.json({ err });
  }
}
