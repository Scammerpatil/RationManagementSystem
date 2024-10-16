import dbConfig from "@/middlewares/db.config";
import FairPriceShop from "@/models/FairPriceShop";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  const { taluka } = await req.json();

  try {
    const temp = await FairPriceShop.find().populate("address");

    var fpsList = [];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].address.taluka === taluka) {
        fpsList.push(temp[i]);
      }
    }

    if (fpsList.length > 0) {
      return NextResponse.json(fpsList);
    } else {
      return NextResponse.json({
        message: "Fair Price Shop not found for this taluka",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
