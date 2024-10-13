import dbConfig from "@/middlewares/db.config";
import Address from "@/models/Address";
import RationCard from "@/models/RationCard";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  const { _id } = await req.json();
  try {
    const rationCard = await RationCard.findOne({ head: _id })
      .populate("head")
      .populate("members")
      .populate("address");
    console.log(rationCard);
    if (!rationCard) {
      return NextResponse.json(
        { error: "Ration card not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ rationCard }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
