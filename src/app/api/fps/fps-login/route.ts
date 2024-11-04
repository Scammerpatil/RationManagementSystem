import bcrypt from "bcryptjs";
import FairPriceShop from "@/models/FairPriceShop";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";

dbConfig();

export async function POST(req: NextRequest) {
  const { fpsUserId, password } = await req.json();
  console.log(fpsUserId, password);

  if (!fpsUserId || !password) {
    return NextResponse.json(
      { message: "Please provide FPS ID and password" },
      { status: 400 }
    );
  }
  try {
    const fps = await FairPriceShop.findOne({ fpsUserId }).populate("address");
    if (!fps) {
      return NextResponse.json(
        { message: "Fair Price Shop not found" },
        { status: 404 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, fps.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 401 }
      );
    }

    const tokenData = {
      fpsId: fps.fpsUserId,
      ownerName: fps.fullName,
      pincode: fps.pincode,
      role: fps.role,
      isAdminApproved: fps.isAdminApproved,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Login successful",
      token,
      user: {
        fpsId: fps.fpsId,
        ownerName: fps.fullName,
        pincode: fps.pincode,
        role: fps.role,
      },
    });
    setTokenCookie(response, token);

    return response;
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Function to set the JWT token in a cookie
const setTokenCookie = (response: NextResponse, token: string) => {
  response.cookies.set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 day
  });
};
