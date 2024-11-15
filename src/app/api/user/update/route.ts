import dbConfig from "@/middlewares/db.config";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function PUT(req: NextRequest) {
  const { formData } = await req.json();
  console.log(formData);
  const user = await User.findOneAndUpdate({ _id: formData._id }, formData);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  return NextResponse.json(user, { status: 200 });
}
