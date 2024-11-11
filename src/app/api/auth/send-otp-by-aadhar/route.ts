import { NextRequest, NextResponse } from "next/server";
import verifyEmail from "@/middlewares/verifyemail";
import User from "@/models/User";
import RationCard from "@/models/RationCard";
import dbConfig from "@/middlewares/db.config";

dbConfig();

export async function POST(req: NextRequest) {
  const { aadhaar, rationNumber } = await req.json();
  var number = aadhaar || rationNumber;

  if (!number) {
    return NextResponse.json(
      { message: "Please provide a valid number" },
      { status: 400 }
    );
  }

  let userEmail: string | null = null;

  const user = await User.findOne({ aadharNumber: number });
  if (user) {
    userEmail = user.email;
  } else {
    const rationCard = await RationCard.findOne({
      rationNumber: number,
    }).populate("head");
    if (rationCard && rationCard.head && rationCard.head.email) {
      userEmail = rationCard.head.email;
    }
  }

  if (!userEmail) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(token);
  const response = await verifyEmail(userEmail, token);
  if (response) {
    return NextResponse.json({ token, userEmail }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Email not found" }, { status: 404 });
  }
}
