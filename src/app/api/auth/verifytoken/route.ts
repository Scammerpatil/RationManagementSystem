import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ error: "No token found" });
  }
  try {
    var user = jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ user, status: 200 });
  } catch (err) {
    NextResponse.json({ err });
  }
}
