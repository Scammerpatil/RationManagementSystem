import bcrypt from "bcryptjs";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import RationCard from "@/models/RationCard";
import dbConfig from "@/middlewares/db.config";

dbConfig();

export async function POST(req: NextRequest) {
  const { aadhaar, rationNumber, password } = await req.json();

  if (!aadhaar && !rationNumber) {
    return NextResponse.json(
      { message: "Please provide Aadhaar or ration number" },
      { status: 400 }
    );
  }

  let user;
  let rationCard;

  if (aadhaar) {
    user = await User.findOne({ aadharNumber: aadhaar });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    rationCard = await RationCard.findOne({ head: user._id }).populate("head");
  } else {
    rationCard = await RationCard.findOne({
      rationCardNumber: rationNumber,
    }).populate("head");
    if (!rationCard) {
      return NextResponse.json(
        { message: "Ration card not found" },
        { status: 404 }
      );
    }
    user = rationCard.head;
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return NextResponse.json(
      { message: "Incorrect password" },
      { status: 401 }
    );
  }

  // Create a minimal data object for the token
  const tokenData = {
    email: user.email,
    role: user.role,
    isAdminApproved: rationCard.isAdminApproved,
    rationCardId: rationCard._id,
  };

  const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  const response = NextResponse.json({
    message: "Login successful",
    token,
    rationCard,
  });

  setTokenCookie(response, token);

  return response;
}

const setTokenCookie = (response: NextResponse, token: string) => {
  response.cookies.set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 day
  });
};
