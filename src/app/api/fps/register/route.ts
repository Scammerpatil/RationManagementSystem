import bcrypt from "bcryptjs";
import dbConfig from "@/middlewares/db.config";
import Address from "@/models/Address";
import FairPriceShop from "@/models/FairPriceShop";
import Stock from "@/models/Stock";
import { NextRequest, NextResponse } from "next/server";
import Tehsil from "@/models/Tehsil";

dbConfig();

export async function POST(req: NextRequest) {
  const fpsData = await req.json();
  const { fullName, mobileNumber, email, address, password } = fpsData;
  const { street, taluka, district, state, pincode } = address;

  // Check if an FPS already exists with the same pincode
  const existingFPS = await FairPriceShop.findOne({ pincode });
  if (existingFPS && existingFPS.isAdminApproved) {
    return NextResponse.json(
      { message: "FPS already exists with this pincode" },
      { status: 400 }
    );
  }

  const existingTeshsil = await Tehsil.findOne({
    taluka: taluka.toLowerCase(),
  });
  console.log("Existing Taluka:", existingTeshsil);
  if (!existingTeshsil) {
    return NextResponse.json(
      { message: "Taluka does not exist" },
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

    const newStock = new Stock(initialStock);
    const savedStock = await newStock.save();
    const remainingStock = new Stock(initialStock);
    const savedRemainingStock = await remainingStock.save();

    const fpsShopNumber = await generateFPSShopNumber(taluka);

    const newFps = new FairPriceShop({
      fpsUserId: fpsShopNumber,
      fullName,
      mobileNumber,
      email,
      pincode,
      password: hashedPassword,
      address: savedAddress._id,
      stock: savedStock._id,
      remainingStock: savedRemainingStock._id,
      isAdminApproved: false,
    });
    await newFps.save();

    return NextResponse.json({
      message: "FPS Registered Successfully",
      fpsId: fpsShopNumber,
    });
  } catch (error: any) {
    console.error("Error registering FPS:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

const generateFPSShopNumber = async (taluka: String) => {
  const regionCode = "FPS";

  const talukaCode = taluka.substring(0, 2).toUpperCase();

  const lastShop = await FairPriceShop.findOne({
    fpsUserId: { $regex: `^${regionCode}-${talukaCode}-` },
  }).sort({ fpsUserId: -1 });

  let newNumber = "0001";

  if (lastShop) {
    const lastNumber = parseInt(lastShop.fpsUserId.split("-").pop(), 10);
    newNumber = (lastNumber + 1).toString().padStart(4, "0");
  }

  return `${regionCode}-${talukaCode}-${newNumber}`;
};
