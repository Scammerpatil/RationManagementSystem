export type User = {
  fullName: string;
  email: string;
  role?: "user" | "admin";
  aadharNumber: string;
  mobileNumber?: string;
  dob: Date | string;
  gender: string;
  occupation?: string;
  caste?: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  isHead?: boolean;
  relationship?:
    | "father"
    | "son"
    | "mother"
    | "daughter"
    | "spouse"
    | "self"
    | "brother"
    | "sister";
  income: number;
  aadhaarCardUrl: string;
  incomeProofUrl?: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};
