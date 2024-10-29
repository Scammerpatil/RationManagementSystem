import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  var { token } = await req.json();
  if (!token) {
    try {
      token = req.cookies.get("token")?.value;
    } catch (error) {
      return NextResponse.json({ error: "No token found" });
    }
  }
  try {
    var user = jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ user, status: 200 });
  } catch (err) {
    NextResponse.json({ err });
  }
}
