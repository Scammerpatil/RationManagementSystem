import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConfig from "@/middlewares/db.config";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import User from "@/models/User";
import Address from "@/models/Address";
import RationCard from "@/models/RationCard";
import Stock from "@/models/Stock";
import rationCardRequest from "@/middlewares/rationCardRequest";
import mongoose from "mongoose";
import FairPriceShop from "@/models/FairPriceShop";

// Configure database connection
dbConfig();

// Main handler function for POST requests to create a user
export async function POST(req: NextRequest) {
  const formData = await req.formData();
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
  } = parseFormData(formData);

  // Validate Fair Price Shop approval status based on user's pincode
  const fps = await FairPriceShop.findOne({ pincode: pincode });
  if (!fps || !fps.isAdminApproved) {
    return NextResponse.json(
      { message: "Fair Price Shop not found or not approved" },
      { status: 400 }
    );
  }

  // Start a MongoDB session and transaction for safe creation
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if a user with the given Aadhar number or email already exists
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

    // Ensure a password is provided
    if (!password) {
      await session.abortTransaction();
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    // Hash the user password
    const hashedPassword = await hashPassword(password as string);

    // Verify that required documents are provided
    if (!aadhaarFront || !aadhaarBack || !incomeCertificate) {
      await session.abortTransaction();
      return NextResponse.json(
        { message: "All document files are required" },
        { status: 400 }
      );
    }

    // Upload document files to Cloudinary
    const uploadedDocs = await uploadDocuments(
      {
        aadhaarFront: aadhaarFront as Blob,
        aadhaarBack: aadhaarBack as Blob,
        incomeCertificate: incomeCertificate as Blob,
      },
      aadharNumber as string
    );

    // Create the new user with the uploaded documents and hashed password
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

    // Create a ration card for the head of the household if applicable
    if (isHead) {
      const scheme: "PHH" | "AAY" | "APL" | "BPL" | "AY" =
        determineScheme(income);
      await createRationCard(
        newUser,
        { street, state, pincode, taluka, district },
        income,
        scheme,
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

// Parse and validate form data input
function parseFormData(formData: FormData) {
  return {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    aadharNumber: formData.get("aadharNumber"),
    dob: new Date(formData.get("dob") as string),
    income: validateNumber(formData.get("income"), "income"),
    mobileNumber: formData.get("mobileNumber"),
    isHead: formData.get("isHead") === "true",
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
  };
}

// Validate number fields to ensure they are valid numbers
function validateNumber(
  value: FormDataEntryValue | null,
  fieldName: string
): number {
  const numberValue = parseFloat(value as string);
  if (isNaN(numberValue)) {
    throw new Error(`${fieldName} must be a number.`);
  }
  return numberValue;
}

// Hashes password securely using bcrypt
async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Uploads required documents to Cloudinary
async function uploadDocuments(
  files: { aadhaarFront: Blob; aadhaarBack: Blob; incomeCertificate: Blob },
  aadharNumber: string
) {
  try {
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
  } catch (error) {
    console.error("Document upload failed:", error);
    throw new Error("Document upload failed");
  }
}

// Helper function to upload individual files to Cloudinary
async function uploadFile(file: Blob, aadharNumber: string, type: string) {
  const fileStream = Buffer.from(await file.arrayBuffer());
  return await useCloudinaryUpload(
    fileStream,
    "aadhaars",
    `${aadharNumber}_${type}`
  );
}

// Creates a new user document and saves it in MongoDB
async function createUser(userData: any, session: mongoose.ClientSession) {
  const newUser = new User({
    ...userData,
    aadhaarFrontCardUrl: userData.uploadedDocs.aadhaarFrontCardUrl.secure_url,
    aadhaarBackCardUrl: userData.uploadedDocs.aadhaarBackCardUrl.secure_url,
    incomeProofUrl: userData.uploadedDocs.incomeProofUrl.secure_url,
  });
  return await newUser.save({ session });
}

// Determines the ration card scheme based on income
function determineScheme(income: number): "PHH" | "AAY" | "APL" | "BPL" | "AY" {
  if (income <= 15000) return "AAY";
  if (income > 15000 && income <= 50000) return "BPL";
  if (income > 50000 && income <= 100000) return "PHH";
  if (income > 100000 && income <= 200000) return "APL";
  return "AY";
}

// Creates a ration card for the user and assigns initial stock based on the scheme
async function createRationCard(
  user: any,
  addressData: any,
  income: number,
  scheme: string,
  session: mongoose.ClientSession
) {
  const address = new Address({ ...addressData });
  const savedAddress = await address.save({ session });

  const cardType = determineCardType(income);
  const initialStock = getInitialStock(
    scheme as "AAY" | "BPL" | "PHH" | "APL" | "AY"
  );

  const stock = new Stock({ ...initialStock });
  const savedStock = await stock.save({ session });

  const newRationCard = new RationCard({
    rationCardNumber: await generateRationCardNumber(),
    cardType,
    scheme,
    taluka: addressData.taluka.toLowerCase(),
    status: "Active",
    head: user._id,
    address: savedAddress._id,
    stock: savedStock._id,
  });

  await newRationCard.save({ session });

  if (newRationCard) {
    await rationCardRequest(user.email, await newRationCard.populate("head"));
  }
}

// Generate an initial stock for a given ration card scheme
function getInitialStock(scheme: "AAY" | "BPL" | "PHH" | "APL" | "AY") {
  const baseStock = {
    AAY: { wheat: 10, rice: 8, bajra: 3, sugar: 2, corn: 2, oil: 1.5 },
    BPL: { wheat: 8, rice: 6, bajra: 2, sugar: 1.5, corn: 1.5, oil: 1 },
    PHH: { wheat: 5, rice: 5, bajra: 2, sugar: 1, corn: 1, oil: 1 },
    APL: { wheat: 3, rice: 3, bajra: 1, sugar: 0.5, corn: 0.5, oil: 0.5 },
    AY: { wheat: 1, rice: 1, bajra: 0.5, sugar: 0.25, corn: 0.25, oil: 0.25 },
  };

  const stock = { ...baseStock[scheme] };

  return stock;
}

// Helper to determine card type based on income
function determineCardType(income: number): "Yellow" | "Saffron" | "White" {
  if (income <= 15000) return "Yellow";
  if (income > 15000 && income <= 100000) return "Saffron";
  return "White";
}

// Generate a unique ration card number (placeholder implementation)
const generateRationCardNumber = async () => {
  const regionCode = "MH";
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
  const lastCard = await RationCard.findOne({
    rationCardNumber: { $regex: `^${regionCode}${currentYear}` },
  }).sort({ rationCardNumber: -1 });
  let newNumber = "0001";
  if (lastCard) {
    console.log(lastCard.rationCardNumber);
    const lastNumber = parseInt(lastCard.rationCardNumber.slice(-4));
    newNumber = (lastNumber + 1).toString().padStart(4, "0");
  }
  return `${regionCode}${currentYear}${currentMonth}${newNumber}`;
};
