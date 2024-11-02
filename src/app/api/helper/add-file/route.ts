import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  const type = formData.get("type");
  const aadharNumber = formData.get("aadharNumber");
  var fileName = `${aadharNumber}_${type}`.replace(/\s/g, "_");
  const fileStream = Buffer.from(await (file as File)!.arrayBuffer());
  try {
    const data = await useCloudinaryUpload(fileStream, "aadhaars", fileName);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.error();
  }
}
