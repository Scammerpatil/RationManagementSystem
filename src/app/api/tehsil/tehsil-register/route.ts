import bcrypt from "bcryptjs";
import Tehsil from "@/models/Tehsil";
import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import Address from "@/models/Address";
import Stock from "@/models/Stock";

dbConfig();

export async function POST(req: NextRequest) {
  const { tehsilUserId, password, address } = await req.json();
  const { street, taluka, district, state, pincode } = address;
  console.log("Address Pincode:", pincode);

  const newAddress = new Address({
    street,
    taluka,
    district,
    state,
    pincode,
  });
  const savedAddress = await newAddress.save();
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

  // Validate the input
  if (!tehsilUserId || !password) {
    return NextResponse.json(
      { message: "Tehsil User ID and password are required." },
      { status: 400 }
    );
  }

  try {
    // Check if the Tehsil User ID already exists
    const existingTehsil = await Tehsil.findOne({ tehsilUserId });
    if (existingTehsil) {
      return NextResponse.json(
        { message: "Tehsil User ID already exists." },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new Tehsil document
    const newTehsil = new Tehsil({
      tehsilUserId,
      password: hashedPassword,
      address: savedAddress._id,
      fpsShopUnder: [],
      officers: [],
      pincode: savedAddress.pincode,
      stock: savedStock._id,
      transactions: [],
      allocatedStock: [],
    });

    await newTehsil.save();

    return NextResponse.json(
      { message: "Tehsil registered successfully!", tehsil: newTehsil },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error registering Tehsil:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
