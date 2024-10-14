import { NextRequest, NextResponse } from "next/server";
import verifyEmail from "@/middlewares/verifyemail";
import User from "@/models/User";
import RationCard from "@/models/RationCard";
import dbConfig from "@/middlewares/db.config";

dbConfig();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { aadhaar, rationNumber } = body;
  console.log(body);
  
  let user = null;
  let email = null;
  if (aadhaar) {
    const aadharNumber = aadhaar.toString();
    user = await User.findOne({ aadharNumber });
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    email = user.email;
  } else if (rationNumber) {
    user = await RationCard.findOne({ rationNumber }).populate("head");
    if (!user) {
      return NextResponse.json(
        { message: "Ration card not found" },
        { status: 404 }
      );
    }
    email = user.head.email;
  }

  if (!email) {
    return NextResponse.json({ message: "Email not found" }, { status: 404 });
  }

  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const response = await verifyEmail(email, token);

  if (response) {
    return NextResponse.json({ token, email }, { status: 200 });
  } else {
    return NextResponse.json(
      { message: "Email sending failed" },
      { status: 500 }
    );
  }
}
