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

  // Check if an FPS already exists with the same pincode
  const existingFPS = await FairPriceShop.findOne({ pincode });
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

    const newStock = new Stock(initialStock);
    const savedStock = await newStock.save();

    const fpsShopNumber = await generateFPSShopNumber(taluka);

    const newFps = new FairPriceShop({
      fpsUserId: fpsShopNumber,
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

    return NextResponse.json({ message: "FPS Registered Successfully", fpsId:fpsUserId });
  } catch (error: any) {
    console.error("Error registering FPS:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const generateFPSShopNumber = async (taluka: String) => {
  const regionCode = "FPS";

  const talukaCode = taluka.substring(0, 2).toUpperCase();
  
  const currentYear = new Date().getFullYear().toString();

  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");

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
