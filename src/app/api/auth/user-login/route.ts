import bcrypt from "bcryptjs";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import RationCard from "@/models/RationCard";

export async function POST(req: NextRequest) {
  const { aadhaar, rationNumber, password } = await req.json();
  if (!aadhaar && !rationNumber) {
    return NextResponse.json(
      { message: "Please provide aadhaar or rationNumber" },
      { status: 400 }
    );
  }
  if (aadhaar) {
    // Check if user exists in database
    const user = await User.findOne({ aadhaar });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    } else {
      var isPasswordCorrect = bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return NextResponse.json(
          { message: "Incorrect password" },
          { status: 401 }
        );
      } else {
        return NextResponse.json(
          { message: "Login successful" },
          { status: 200 }
        );
      }
    }
  } else {
    const rationCard = await RationCard.findOne({ rationNumber }).populate(
      "head"
    );
    var isPasswordCorrect = bcrypt.compare(password, rationCard.head.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 401 }
      );
    } else {
      return NextResponse.json(
        { message: "Login successful" },
        { status: 200 }
      );
    }
  }
}
