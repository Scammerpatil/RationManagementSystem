import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import dbConfig from "@/middlewares/db.config";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import Address from "@/models/Address";
import RationCard from "@/models/RationCard";
import Stock from "@/models/Stock";

dbConfig();

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const fullName = formData.get("fullName");
  const email = formData.get("email");
  const aadharNumber = formData.get("aadharNumber");
  const dob = formData.get("dob");
  const income = parseFloat(formData.get("income") as string);
  const mobileNumber = formData.get("mobileNumber");
  const isHead = formData.get("isHead");
  const gender = (formData.get("gender") as string).toLowerCase();
  const occupation = formData.get("occupation");
  const caste = formData.get("caste");
  const relationship = formData.get("relationship");
  const bankName = formData.get("bankName");
  const accountNumber = formData.get("accountNumber");
  const ifscCode = formData.get("ifscCode");
  const password = formData.get("password");
  const street = formData.get("street");
  const state = formData.get("state");
  const pincode = formData.get("pincode");
  const taluka = formData.get("taluka");
  const district = formData.get("district");
  const aadhaarFront = formData.get("aadhaarFront");
  const aadhaarBack = formData.get("aadhaarBack");
  const incomeCertificate = formData.get("incomeCertificate");
  const familyMembersCount =
    parseInt(formData.get("familyMembersCount") as string, 10) || 1;

  const aadhaarFrontCardUrl = await uploadFile(
    aadhaarFront,
    aadharNumber,
    "front"
  );
  const aadhaarBackCardUrl = await uploadFile(
    aadhaarBack,
    aadharNumber,
    "back"
  );
  const incomeProofUrl = await uploadFile(
    incomeCertificate,
    aadharNumber,
    "income"
  );

  try {
    const existingUser = await User.findOne({
      $or: [{ aadharNumber }, { email }],
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "User Already Exists" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      role: "user",
      aadharNumber,
      mobileNumber,
      dob,
      isHead: isHead === "true",
      gender,
      occupation,
      caste,
      relationship,
      income,
      bankName,
      accountNumber,
      ifscCode,
      aadhaarBackCardUrl: aadhaarBackCardUrl.secure_url,
      aadhaarFrontCardUrl: aadhaarFrontCardUrl.secure_url,
      incomeProofUrl: incomeProofUrl.secure_url,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    if (isHead) {
      const address = new Address({
        street,
        pincode,
        state,
        taluka,
        district,
      });
      const newAddress = await address.save(); // Await for address save

      const cardType = determineCardType(income);
      const initialStock = getInitialStock(cardType);

      // Multiply initial stock by the number of family members
      const newStock = new Stock({
        month: new Date().toLocaleString("default", { month: "long" }),
        wheat: initialStock.wheat * familyMembersCount,
        rice: initialStock.rice * familyMembersCount,
        bajra: initialStock.bajra * familyMembersCount,
        sugar: initialStock.sugar * familyMembersCount,
        corn: initialStock.corn * familyMembersCount,
        oil: initialStock.oil * familyMembersCount,
      });
      const savedStock = await newStock.save(); // Await for stock save

      const newRationCard = new RationCard({
        rationCardNumber: generateRationCardNumber(),
        cardType,
        status: "Active",
        head: savedUser._id,
        address: newAddress._id,
        stock: savedStock._id,
      });

      await newRationCard.save(); // Await for ration card save
    }

    return NextResponse.json(
      { message: "User Created Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went Wrong" },
      { status: 500 }
    );
  }
}

async function uploadFile(file: Blob, aadharNumber: string, type: string) {
  const fileStream = Buffer.from(await file.arrayBuffer());
  return await useCloudinaryUpload(
    fileStream,
    "aadhaars",
    `${aadharNumber}_${type}`
  );
}

function generateRationCardNumber() {
  let rationCardNumber = "";

  while (rationCardNumber.length < 12) {
    const randomDigit = Math.floor(Math.random() * 10);
    rationCardNumber += randomDigit.toString();
  }

  return rationCardNumber;
}

function determineCardType(income: number): "White" | "Saffron" | "Yellow" {
  if (income <= 10000) {
    return "White";
  } else if (income <= 25000) {
    return "Saffron";
  } else {
    return "Yellow";
  }
}

function getInitialStock(cardType: "White" | "Saffron" | "Yellow") {
  const stock = {
    wheat: 0,
    rice: 0,
    bajra: 0,
    sugar: 0,
    corn: 0,
    oil: 0,
  };

  switch (cardType) {
    case "White":
      stock.wheat = 5;
      stock.rice = 5;
      stock.bajra = 2;
      stock.sugar = 1;
      stock.corn = 1;
      stock.oil = 1;
      break;
    case "Saffron":
      stock.wheat = 3;
      stock.rice = 3;
      stock.bajra = 1;
      stock.sugar = 0.5;
      stock.corn = 0.5;
      stock.oil = 0.5;
      break;
    case "Yellow":
      stock.wheat = 2;
      stock.rice = 2;
      stock.bajra = 0.5;
      stock.sugar = 0.25;
      stock.corn = 0.25;
      stock.oil = 0.25;
      break;
  }

  return stock;
}
