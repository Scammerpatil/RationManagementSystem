import bcrypt from "bcryptjs";
import Tehsil from "@/models/Tehsil";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";

dbConfig();

export async function POST(req: NextRequest) {
  const { tehsilUserId, password } = await req.json();

  if (!tehsilUserId || !password) {
    return NextResponse.json(
      { message: "Please provide Tehsil ID and password" },
      { status: 400 }
    );
  }

  try {
    const tehsil = await Tehsil.findOne({ tehsilUserId }).populate("address");
    if (!tehsil) {
      return NextResponse.json(
        { message: "Tehsil not found" },
        { status: 404 }
      );
    }
    const isPasswordCorrect = await bcrypt.compare(password, tehsil.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 401 }
      );
    }

    const tokenData = {
      tehsilId: tehsil.tehsilUserId,
      role: "tehsil",
      isAdminApproved: true,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Login successful",
      token,
      user: {
        tehsilId: tehsil.tehsilUserId,
        role: "tehsil",
        isAdminApproved: true,
      },
    });

    setTokenCookie(response, token);

    return response;
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

const setTokenCookie = (response: NextResponse, token: string) => {
  response.cookies.set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
  });
};
