import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    aadharNumber: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^\d{12}$/.test(v);
        },
        message: (props: any) =>
          `${props.value} is not a valid Aadhar number! Aadhar number must be 12 digits.`,
      },
    },
    mobileNumber: {
      type: String,
    },
    dob: {
      type: Date,
      required: true,
    },
    isHead: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    occupation: {
      type: String,
      required: false,
    },
    caste: {
      type: String,
      required: false,
    },
    relationship: {
      type: String,
      enum: [
        "father",
        "son",
        "mother",
        "daughter",
        "spouse",
        "self",
        "brother",
        "sister",
      ],
      required: function (this: any) {
        return !this.isHead;
      },
    },
    income: {
      type: Number,
    },
    bankName: {
      type: String,
      required: false,
    },
    accountNumber: {
      type: String,
      required: false,
    },
    ifscCode: {
      type: String,
      required: false,
    },
    aadhaarFrontCardUrl: {
      type: String,
      required: true,
    },
    aadhaarBackCardUrl: {
      type: String,
      required: true,
    },
    incomeProofUrl: {
      type: String,
      required: false,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
