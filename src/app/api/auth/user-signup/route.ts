import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConfig from "@/middlewares/db.config";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import User from "@/models/User";
import Address from "@/models/Address";
import RationCard from "@/models/RationCard";
import Stock from "@/models/Stock";
import Application from "@/models/Application";

dbConfig();

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  // Extract data from the request
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

  try {
    const existingUser = await User.findOne({
      $or: [{ aadharNumber }, { email }],
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    if (!password)
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    const hashedPassword = await hashPassword(password);

    // Upload documents
    const uploadedDocs = await uploadDocuments(
      { aadhaarFront, aadhaarBack, incomeCertificate },
      aadharNumber
    );

    // Create new user
    const newUser = await createUser({
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
    });

    if (isHead === "true") {
      await createRationCard(
        newUser,
        { street, state, pincode, taluka, district },
        income,
        familyMembersCount
      );
    }

    return NextResponse.json(
      { message: "User Created Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
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

async function createUser(userData: any) {
  const newUser = new User({
    ...userData,
    aadhaarFrontCardUrl: userData.uploadedDocs.aadhaarFrontCardUrl.secure_url,
    aadhaarBackCardUrl: userData.uploadedDocs.aadhaarBackCardUrl.secure_url,
    incomeProofUrl: userData.uploadedDocs.incomeProofUrl.secure_url,
  });
  return await newUser.save();
}

async function createRationCard(
  user: any,
  addressData: any,
  income: number,
  familyMembersCount: number
) {
  const address = new Address({ ...addressData });
  const savedAddress = await address.save();

  const cardType = determineCardType(income);
  const initialStock = getInitialStock(cardType, familyMembersCount);

  const stock = new Stock({ ...initialStock });
  const savedStock = await stock.save();

  const newRationCard = new RationCard({
    rationCardNumber: generateRationCardNumber(),
    cardType,
    status: "Active",
    head: user._id,
    address: savedAddress._id,
    stock: savedStock._id,
  });

  await newRationCard.save();

  const application = new Application({
    rationCard: newRationCard._id,
  });
  await application.save();
}

function determineCardType(income: number): "White" | "Saffron" | "Yellow" {
  if (income <= 15000) return "Yellow";
  else if (income >= 15000 && income <= 100000) return "Saffron";
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
  Object.keys(stock).forEach((key) => {
    if (key !== "month") {
      stock[key] *= familyMembersCount;
    }
  });

  return stock;
}

function generateRationCardNumber() {
  return Array(12)
    .fill(null)
    .map(() => Math.floor(Math.random() * 10))
    .join("");
}
