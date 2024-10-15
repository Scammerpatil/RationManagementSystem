"use client";

import { Address } from "@/types/Address";
import { User } from "@/types/User";
import { MAHARASHTRA_DISTRICTS, MAHARASHTRA_TALUKAS } from "@/utils/Constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const NewRationPage = () => {
  const [user, setUser] = useState<User>({
    fullName: "",
    email: "",
    aadharNumber: "",
    dob: "",
    income: 0,
    aadhaarCardUrl: "",
    password: "",
    gender: "",
    mobileNumber: "",
    occupation: "",
    caste: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });
  const [files, setFiles] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    incomeCertificate: null,
  });
  const [address, setAddress] = useState<Address>({
    street: "",
    district: "",
    pincode: "",
    state: "",
    taluka: "",
  });
  const [disabled, setDisabled] = useState(true);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (
      user.fullName &&
      user.email &&
      user.aadharNumber &&
      user.income &&
      user.password &&
      user.caste &&
      files.aadhaarFront &&
      files.aadhaarBack &&
      files.incomeCertificate &&
      otpVerified
    ) {
      setDisabled(false);
    }
  }, [user, files, otpVerified]);

  const handleOTPSent = async () => {
    if (user.email === "") {
      toast.error("Please enter email address");
      return;
    }
    const response = axios.post("/api/auth/send-otp", {
      email: user.email,
    });
    toast.promise(response, {
      loading: "Sending OTP...",
      success: (data) => {
        setOtpSent(data.data.token);
        (
          document.getElementById("otpContainer") as HTMLDialogElement
        ).showModal();
        return "OTP sent successfully.";
      },
      error: "Error sending OTP.",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files.aadhaarFront || !files.aadhaarBack || !files.incomeCertificate) {
      toast.error("Please upload all the required files");
      return;
    }

    const data = new FormData();
    data.append("fullName", user.fullName);
    data.append("email", user.email);
    data.append("aadharNumber", user.aadharNumber);
    data.append("dob", new Date(user.dob).toISOString());
    data.append("mobileNumber", user.mobileNumber!);
    data.append("isHead", "true");
    data.append("gender", user.gender);
    data.append("occupation", user.occupation!);
    data.append("caste", user.caste!);
    data.append("relationship", "self");
    data.append("income", user.income.toString());
    data.append("bankName", user.bankName);
    data.append("accountNumber", user.accountNumber);
    data.append("ifscCode", user.ifscCode);
    data.append("password", user.password);
    data.append("street", address.street);
    data.append("state", address.state);
    data.append("pincode", address.pincode);
    data.append("district", address.district);
    data.append("taluka", address.taluka);
    data.append("aadhaarFront", files.aadhaarFront as File);
    data.append("aadhaarBack", files.aadhaarBack as File);
    data.append("incomeCertificate", files.incomeCertificate as File);

    try {
      const response = axios.post("/api/auth/user-signup", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.promise(response, {
        loading: "Submitting application...",
        success: () => {
          router.push("/public-login");
          return "Application submitted successfully.";
        },
        error: (e) => {
          return e.response.data.message;
        },
      });
    } catch (error) {
      toast.error("Error submitting application.");
      console.error("File upload error: ", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFiles({ ...files, [e.target.name]: file });
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8">
        <h2 className="text-4xl font-bold mb-8 text-center text-indigo-700">
          New Ration Card Application Form
        </h2>

        {/* Notes Section */}
        <div className="mb-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p>
            <strong>Note 1:</strong> Applicant must be a Head of family.
          </p>
          <p>
            <strong>Note 2:</strong> If a member is already present in another
            ration card, they must be removed from the previous one.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="bg-white p-10 rounded-lg shadow-lg max-w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Name of Head of Family */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Name of Head Of Family <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={user.fullName}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Gender <span className="text-red-600">*</span>
              </label>
              <select
                name="gender"
                value={user.gender}
                onChange={(e) => setUser({ ...user, gender: e.target.value })}
                className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Email Address <span className="text-red-600">*</span>
              </label>
              <div className="flex flex-row gap-2">
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="mt-2 p-3 block w-full border border-gray-300 bg-gray-50 text-black rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                  placeholder="Enter your Email address"
                  required
                />
                <button
                  type="button"
                  className={`bg-primary px-4 rounded-lg text-black ${
                    otpVerified ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  disabled={user.email === "" || otpVerified}
                  onClick={handleOTPSent}
                >
                  {otpVerified ? "Verified" : "Verify"}
                </button>
              </div>
            </div>

            {/* Income */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Income <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                name="income"
                value={user.income}
                onChange={(e) =>
                  setUser({ ...user, income: Number(e.target.value) })
                }
                className="mt-2 p-3 block w-full border border-gray-300 bg-gray-50 text-black rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter your Email address"
                required
              />
            </div>
            {/* Caste */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Caste <span className="text-red-600">*</span>
              </label>
              <select
                name="caste"
                value={user.caste}
                onChange={(e) => setUser({ ...user, caste: e.target.value })}
                className="mt-2 p-3 block w-full border border-gray-300 bg-gray-50 text-black rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                required
              >
                <option value="">Select Caste</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="OBC">OBC</option>
                <option value="General">General</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Mobile Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="mobile"
                value={user.mobileNumber}
                maxLength={10}
                onChange={(e) => {
                  setUser({ ...user, mobileNumber: e.target.value });
                }}
                className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter mobile number"
                required
              />
            </div>

            {/* Aadhaar Number */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Aadhaar Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="aadhaar"
                value={user.aadharNumber}
                onChange={(e) =>
                  setUser({ ...user, aadharNumber: e.target.value })
                }
                maxLength={12}
                className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter Aadhaar number"
                required
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Date of Birth <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                name="dob"
                onChange={(e) =>
                  setUser({ ...user, dob: new Date(e.target.value) })
                }
                className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
              />
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Occupation <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="occupation"
                value={user.occupation}
                onChange={(e) =>
                  setUser({ ...user, occupation: e.target.value })
                }
                className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter occupation"
                required
              />
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Bank Name (Optional)
              </label>
              <input
                type="text"
                name="bankName"
                value={user.bankName}
                onChange={(e) => setUser({ ...user, bankName: e.target.value })}
                className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter bank name"
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Account Number (Optional)
              </label>
              <input
                type="text"
                name="accountNumber"
                value={user.accountNumber}
                onChange={(e) =>
                  setUser({ ...user, accountNumber: e.target.value })
                }
                className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter account number"
              />
            </div>

            {/* IFSC Code */}
            <div>
              <label className="block text-gray-700 font-semibold">
                IFSC Code (Optional)
              </label>
              <input
                type="text"
                name="ifscCode"
                value={user.ifscCode}
                onChange={(e) => setUser({ ...user, ifscCode: e.target.value })}
                className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter IFSC code"
              />
            </div>

            {/* Street Code */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Street
              </label>
              <input
                type="text"
                name="Street"
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
                className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter Your Street Name"
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-gray-700 font-semibold">
                District
              </label>
              <select
                name="District"
                value={address.district}
                onChange={(e) =>
                  setAddress({ ...address, district: e.target.value })
                }
                className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
              >
                <option value="Select Districts"></option>
                {MAHARASHTRA_DISTRICTS.map((district, idx) => (
                  <option key={idx} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* Taluka Code */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Taluka
              </label>
              <select
                name="Taluka"
                value={address.taluka}
                onChange={(e) =>
                  setAddress({ ...address, taluka: e.target.value })
                }
                className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
              >
                <option value="Select Taluka">Select Taluka</option>
                {address.district &&
                  MAHARASHTRA_TALUKAS[address.district].map((taluka, idx) => (
                    <option key={idx} value={taluka}>
                      {taluka}
                    </option>
                  ))}
              </select>
            </div>

            {/* State Code */}
            <div>
              <label className="block text-gray-700 font-semibold">State</label>
              <select
                name="Taluka"
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
                className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
              >
                <option value="Maharashtra">Maharashtra</option>
              </select>
            </div>

            {/* Pin Code */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Pin Code
              </label>
              <input
                type="text"
                name="Taluka"
                value={address.pincode}
                maxLength={6}
                onChange={(e) =>
                  setAddress({ ...address, pincode: e.target.value })
                }
                className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter Pin Code"
              />
            </div>
            {/* Password */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Password <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                name="password"
                required
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter Password"
              />
            </div>

            {/* Aadhaar Front Photo */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Aadhaar Front Photo <span className="text-red-600">*</span>
              </label>
              <input
                type="file"
                name="aadhaarFront"
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={handleFileChange}
                className="file-input file-input-bordered file-input-primary w-full max-w-xs bg-white text-black"
                required
              />
            </div>

            {/* Aadhaar Back Photo */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Aadhaar Back Photo <span className="text-red-600">*</span>
              </label>
              <input
                type="file"
                name="aadhaarBack"
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={handleFileChange}
                className="file-input file-input-bordered file-input-primary w-full max-w-xs bg-white text-black"
                required
              />
            </div>

            {/* Income Certificate (For Head of Family) */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Income Certificate (For Head of Family){" "}
                <span className="text-red-600">*</span>
              </label>
              <input
                type="file"
                name="incomeCertificate"
                onChange={handleFileChange}
                accept=".pdf, .jpg, .jpeg, .png"
                className="file-input file-input-bordered file-input-primary w-full max-w-xs bg-white text-black"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full bg-green-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 ${
              disabled ? "cursor-not-allowed bg-green-900" : "cursor-pointer"
            }`}
            disabled={disabled}
          >
            Submit Application
          </button>
        </form>
      </div>

      <dialog id="otpContainer" className="modal modal-bottom sm:modal-middle ">
        <div className="modal-box flex flex-col justify-center items-center gap-5">
          <h1 className="mt-5">Verify Your Email</h1>
          <label
            htmlFor="name"
            className="mb-3 block text-sm text-base-content"
          >
            Please Enter the OTP
          </label>
          <div className="flex gap-2 mt-5">
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-50 rounded-sm border border-stroke bg-base-300 px-6 py-3 text-base-content outline-none transition-all duration-300 focus:border-primary"
            />
            <button
              className="w-50 rounded-sm border border-stroke bg-accent text-accent-content px-6 py-3 outline-none transition-all duration-300 focus:border-primary"
              onClick={() => {
                if (otp === otpSent) {
                  setOtpVerified(true);
                  toast.success("Email Verified Successfully");
                  (
                    document.getElementById("otpContainer") as HTMLDialogElement
                  ).close();
                } else {
                  toast.error("Invalid OTP");
                }
              }}
            >
              Verify
            </button>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-outline text-base-content">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};
export default NewRationPage;
