import bcrypt from "bcryptjs";
import dbConfig from "@/middlewares/db.config";
import Address from "@/models/Address";
import FairPriceShop from "@/models/FairPriceShop";
import Stock from "@/models/Stock";
import { NextRequest, NextResponse } from "next/server";

dbConfig();
export async function POST(req: NextRequest) {
  const fpsData = await req.json();
  const { fpsUserId, fullName, mobileNumber, email, role, address, password } =
    fpsData;
  const { street, taluka, district, state, pincode } = address;

  const existingFPS = await FairPriceShop.findOne({ pincode: pincode });
  if (existingFPS) {
    return NextResponse.json(
      { message: "FPS already exists with this pincode" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    // Create and save the address
    const newAddress = new Address({
      street,
      taluka,
      district,
      state,
      pincode,
    });
    const savedAddress = await newAddress.save();

    // Initialize stock with default values
    const initialStock = {
      month: "January",
      wheat: 0,
      rice: 0,
      bajra: 0,
      sugar: 0,
      corn: 0,
      oil: 0,
    };

    // Create and save the stock
    const newStock = new Stock(initialStock);
    const savedStock = await newStock.save();

    // Create and save the Fair Price Shop
    const newFps = new FairPriceShop({
      fpsUserId,
      fullName,
      mobileNumber,
      email,
      role,
      pincode,
      password: hashedPassword,
      address: savedAddress._id,
      stock: savedStock._id,
    });
    await newFps.save();

    return NextResponse.json({ message: "FPS Registered Successfully" });
  } catch (error: any) {
    console.error("Error registering FPS:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
