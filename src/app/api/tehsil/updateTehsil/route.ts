import Tehsil from "@/models/Tehsil";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const { tehsil } = await req.json();
  const updatedTehsil = await Tehsil.findByIdAndUpdate(tehsil._id, tehsil);
  if (!updatedTehsil) {
    return NextResponse.json({ message: "Tehsil not found" }, { status: 404 });
  }
  return NextResponse.json(updatedTehsil);
}
