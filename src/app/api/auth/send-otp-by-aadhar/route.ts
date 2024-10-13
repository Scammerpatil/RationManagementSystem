import { NextRequest, NextResponse } from "next/server";
import verifyEmail from "@/middlewares/verifyemail";
import User from "@/models/User";
import RationCard from "@/models/RationCard";
import dbConfig from "@/middlewares/db.config";

dbConfig();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { aadhaar, rationNumber } = body;
  if (aadhaar) {
    const user = await User.findOne({ aadhaar });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    } else {
      var email = user.email;
    }
  } else {
    const user = await RationCard.findOne({ rationNumber }).populate("head");
    var email = user.head.email;
  }
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const response = await verifyEmail(email, token);
  if (response) {
    return NextResponse.json({ token, email }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Email not found" }, { status: 404 });
  }
}
