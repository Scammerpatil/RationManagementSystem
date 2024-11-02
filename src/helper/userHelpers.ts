import bcrypt from "bcryptjs";
import User from "@/models/User";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function uploadDocuments(files: any, aadharNumber: string) {
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

export async function createUser(userData: any, session: any) {
  const hashedPassword = await hashPassword(userData.password);

  const newUser = new User({
    ...userData,
    password: hashedPassword,
    aadhaarFrontCardUrl: userData.uploadedDocs.aadhaarFrontCardUrl.secure_url,
    aadhaarBackCardUrl: userData.uploadedDocs.aadhaarBackCardUrl.secure_url,
    incomeProofUrl: userData.uploadedDocs.incomeProofUrl.secure_url,
  });

  return await newUser.save({ session });
}
