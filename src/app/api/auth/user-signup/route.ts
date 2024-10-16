import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConfig from "@/middlewares/db.config";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import User from "@/models/User";
import Address from "@/models/Address";
import RationCard from "@/models/RationCard";
import Stock from "@/models/Stock";
import Application from "@/models/Application";
import rationCardRequest from "@/middlewares/rationCardRequest";
import mongoose from "mongoose";

dbConfig();

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  // Parse form data
  const {
    fullName,
    email,
    aadharNumber,
    dob,
    mobileNumber,
    isHead,
    gender,
    occupation,
    caste,
    relationship,
    income,
    bankName,
    accountNumber,
    ifscCode,
    password,
    street,
    state,
    pincode,
    taluka,
    district,
    aadhaarFront,
    aadhaarBack,
    incomeCertificate,
    familyMembersCount,
  } = parseFormData(formData);

  console.log(fullName);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({
      $or: [{ aadharNumber }, { email }],
    }).session(session);

    if (existingUser) {
      await session.abortTransaction();
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    if (!password) {
      await session.abortTransaction();
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password as string);

    // Upload documents
    if (!aadhaarFront || !aadhaarBack || !incomeCertificate) {
      await session.abortTransaction();
      return NextResponse.json(
        { message: "All document files are required" },
        { status: 400 }
      );
    }

    const uploadedDocs = await uploadDocuments(
      {
        aadhaarFront: aadhaarFront as Blob,
        aadhaarBack: aadhaarBack as Blob,
        incomeCertificate: incomeCertificate as Blob,
      },
      aadharNumber as string
    );

    // Create new user
    const newUser = await createUser(
      {
        fullName,
        email,
        aadharNumber,
        dob,
        mobileNumber,
        gender,
        occupation,
        caste,
        relationship,
        income,
        bankName,
        accountNumber,
        ifscCode,
        password: hashedPassword,
        uploadedDocs,
        isHead: true,
      },
      session
    );

    if (isHead === "true") {
      await createRationCard(
        newUser,
        { street, state, pincode, taluka, district },
        income,
        familyMembersCount,
        session
      );
    }

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      { message: "User Created Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Helper Functions

function parseFormData(formData: FormData) {
  return {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    aadharNumber: formData.get("aadharNumber"),
    dob: formData.get("dob"),
    income: parseFloat(formData.get("income") as string),
    mobileNumber: formData.get("mobileNumber"),
    isHead: formData.get("isHead"),
    gender: (formData.get("gender") as string).toLowerCase(),
    occupation: formData.get("occupation"),
    caste: formData.get("caste"),
    relationship: formData.get("relationship"),
    bankName: formData.get("bankName"),
    accountNumber: formData.get("accountNumber"),
    ifscCode: formData.get("ifscCode"),
    password: formData.get("password"),
    street: formData.get("street"),
    state: formData.get("state"),
    pincode: formData.get("pincode"),
    taluka: formData.get("taluka"),
    district: formData.get("district"),
    aadhaarFront: formData.get("aadhaarFront"),
    aadhaarBack: formData.get("aadhaarBack"),
    incomeCertificate: formData.get("incomeCertificate"),
    familyMembersCount:
      parseInt(formData.get("familyMembersCount") as string, 10) || 1,
  };
}

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function uploadDocuments(
  files: { aadhaarFront: Blob; aadhaarBack: Blob; incomeCertificate: Blob },
  aadharNumber: string
) {
  const aadhaarFrontCardUrl = await uploadFile(
    files.aadhaarFront,
    aadharNumber,
    "front"
  );
  const aadhaarBackCardUrl = await uploadFile(
    files.aadhaarBack,
    aadharNumber,
    "back"
  );
  const incomeProofUrl = await uploadFile(
    files.incomeCertificate,
    aadharNumber,
    "income"
  );

  return { aadhaarFrontCardUrl, aadhaarBackCardUrl, incomeProofUrl };
}

async function uploadFile(file: Blob, aadharNumber: string, type: string) {
  const fileStream = Buffer.from(await file.arrayBuffer());
  return await useCloudinaryUpload(
    fileStream,
    "aadhaars",
    `${aadharNumber}_${type}`
  );
}

async function createUser(userData: any, session: any) {
  const newUser = new User({
    ...userData,
    aadhaarFrontCardUrl: userData.uploadedDocs.aadhaarFrontCardUrl.secure_url,
    aadhaarBackCardUrl: userData.uploadedDocs.aadhaarBackCardUrl.secure_url,
    incomeProofUrl: userData.uploadedDocs.incomeProofUrl.secure_url,
  });
  return await newUser.save({ session });
}

async function createRationCard(
  user: any,
  addressData: any,
  income: number,
  familyMembersCount: number,
  session: any
) {
  const address = new Address({ ...addressData });
  const savedAddress = await address.save({ session });

  const cardType = determineCardType(income);
  const initialStock = getInitialStock(cardType, familyMembersCount);

  const stock = new Stock({ ...initialStock });
  const savedStock = await stock.save({ session });

  const newRationCard = new RationCard({
    rationCardNumber: await generateRationCardNumber(),
    cardType,
    status: "Active",
    head: user._id,
    address: savedAddress._id,
    stock: savedStock._id,
  });

  await newRationCard.save({ session });

  const application = new Application({
    rationCard: newRationCard._id,
  });
  await application.save({ session });

  if (newRationCard) {
    await rationCardRequest(user.email, await newRationCard.populate("head"));
  }
}

function determineCardType(income: number): "White" | "Saffron" | "Yellow" {
  if (income <= 15000) return "Yellow";
  if (income <= 100000) return "Saffron";
  return "White";
}

function getInitialStock(
  cardType: "White" | "Saffron" | "Yellow",
  familyMembersCount: number
) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonth = months[new Date().getMonth()];

  const baseStock = {
    White: {
      month: currentMonth,
      wheat: 5,
      rice: 5,
      bajra: 2,
      sugar: 1,
      corn: 1,
      oil: 1,
    },
    Saffron: {
      month: currentMonth,
      wheat: 3,
      rice: 3,
      bajra: 1,
      sugar: 0.5,
      corn: 0.5,
      oil: 0.5,
    },
    Yellow: {
      month: currentMonth,
      wheat: 2,
      rice: 2,
      bajra: 0.5,
      sugar: 0.25,
      corn: 0.25,
      oil: 0.25,
    },
  };

  const stock = baseStock[cardType];
  (Object.keys(stock) as (keyof typeof stock)[]).forEach((key) => {
    if (key !== "month") {
      stock[key] *= familyMembersCount;
    }
  });

  return stock;
}

const generateRationCardNumber = async () => {
  const regionCode = "MH";
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");

  const lastCard = await RationCard.findOne({
    rationCardNumber: { $regex: `^${regionCode}${currentYear}` },
  }).sort({ rationCardNumber: -1 });

  let newNumber = "0001";

  if (lastCard) {
    const lastNumber = parseInt(lastCard.rationCardNumber.slice(-4));
    newNumber = (lastNumber + 1).toString().padStart(4, "0");
  }

  return `${regionCode}${currentYear}${currentMonth}${newNumber}`;
};
