import dbConfig from "@/middlewares/db.config";
import RationCard from "@/models/RationCard";
import Tehsil from "@/models/Tehsil";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  const { taluka } = await req.json();
  const lowerCaseTaluka = taluka.toLowerCase();
  User;
  try {
    const rationCards = await RationCard.find({ taluka: lowerCaseTaluka })
      .populate("address")
      .populate("head");
    if (rationCards) {
      return NextResponse.json(rationCards);
    } else {
      return NextResponse.json({
        message: "Ration Card not found for this taluka",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
