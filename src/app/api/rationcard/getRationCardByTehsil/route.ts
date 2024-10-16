import dbConfig from "@/middlewares/db.config";
import RationCard from "@/models/RationCard";
import Tehsil from "@/models/Tehsil";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  const { taluka } = await req.json();
  User;
  try {
    const temp = await RationCard.find().populate("address").populate("head");
    var rationCards = [];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].address.taluka === taluka) {
        rationCards.push(temp[i]);
      }
    }
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
