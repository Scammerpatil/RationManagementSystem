"use client";
import { MAHARASHTRA_DISTRICTS, MAHARASHTRA_TALUKAS } from "@/utils/Constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const FairPriceShopForm = () => {
  const [disabled, setDisabled] = useState(true);
  const [otp, setOtp] = useState({
    otp: "",
    otpSent: "",
    isVerified: false,
  });
  const [fpsData, setFpsData] = useState({
    fpsUserId: "",
    fullName: "",
    mobileNumber: "",
    email: "",
    role: "fps",
    password: "",
    address: {
      street: "",
      taluka: "",
      district: "",
      state: "Maharashtra",
      pincode: "",
    },
  });

  useEffect(() => {
    setFpsData({
      ...fpsData,
      fpsUserId: `FPS-${Math.floor(100000 + Math.random() * 900000)}`,
    });
  }, []);

  useEffect(() => {
    if (
      fpsData.mobileNumber.length === 10 &&
      fpsData.fullName !== "" &&
      fpsData.email !== "" &&
      fpsData.address.street !== "" &&
      fpsData.address.taluka !== "" &&
      fpsData.address.district !== "" &&
      fpsData.address.state !== "" &&
      fpsData.address.pincode !== "" &&
      otp.isVerified === true
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [fpsData, otp]);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFpsData({ ...fpsData, [name]: value });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFpsData({ ...fpsData, address: { ...fpsData.address, [name]: value } });
  };

  const handleOTPSent = async () => {
    if (fpsData.email === "") {
      toast.error("Please enter email address");
      return;
    }
    const response = axios.post("/api/auth/send-otp", {
      email: fpsData.email,
    });
    toast.promise(response, {
      loading: "Sending OTP...",
      success: (data) => {
        setOtp({ ...otp, otpSent: data.data.token });
        (
          document.getElementById("otpContainer") as HTMLDialogElement
        ).showModal();
        return "OTP sent successfully.";
      },
      error: "Error sending OTP.",
    });
  };

  const handleCopyToClipboard = () => {
    if (fpsData.fpsUserId) {
      navigator.clipboard
        .writeText(fpsData.fpsUserId)
        .then(() => {
          alert("FPS User ID copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy FPS User ID:", err);
        });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = axios.post("/api/fps/register", fpsData);
    toast.promise(response, {
      loading: "Registering Fair Price Shop...",
      success: () => {
        router.push("/fps-login");
        return "Fair Price Shop registered successfully.";
      },
      error: "Error registering Fair Price Shop.",
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8">
        <div className="mb-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p>
            <strong>Note 1:</strong> Note the FPS ID and password for future
            reference.
          </p>
          <p>
            <strong>Note 2:</strong> FPS ID is the unique ID provided to you by
            the government.
          </p>
        </div>
        <h2 className="text-4xl font-bold mb-8 text-center text-indigo-700">
          Fair Price Shop Registration Form
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-lg shadow-lg max-w-full"
        >
          {/* Fair Price Shop Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* FPS User ID */}
            <div>
              <label className="block text-gray-700 font-semibold">
                FPS User ID <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="fpsUserId"
                value={fpsData.fpsUserId}
                onChange={handleChange}
                className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter FPS User ID"
                disabled
                required
                onClick={handleCopyToClipboard}
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={fpsData.fullName}
                onChange={handleChange}
                className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Mobile Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="mobileNumber"
                value={fpsData.mobileNumber}
                maxLength={10}
                onChange={handleChange}
                className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter mobile number"
                required
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
                value={fpsData.password}
                onChange={handleChange}
                className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Email <span className="text-red-600">*</span>
              </label>
              <div className="flex flex-row gap-2">
                <input
                  type="email"
                  name="email"
                  value={fpsData.email}
                  onChange={handleChange}
                  className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                  placeholder="Enter email"
                  required
                />
                {!otp.isVerified && (
                  <button
                    className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/80 text-black"
                    onClick={handleOTPSent}
                  >
                    Verify
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Address Fields */}
          <h3 className="text-2xl font-bold mb-4 text-black">
            Address Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Street */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Street <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="street"
                value={fpsData.address.street}
                onChange={handleAddressChange}
                className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter street"
                required
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-gray-700 font-semibold">
                District <span className="text-red-600">*</span>
              </label>
              <select
                name="district"
                value={fpsData.address.district}
                onChange={(e) => {
                  setFpsData({
                    ...fpsData,
                    address: { ...fpsData.address, district: e.target.value },
                  });
                }}
                className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                required
              >
                <option value="Select Districts" defaultChecked>
                  Select District
                </option>
                {MAHARASHTRA_DISTRICTS.map((district, idx) => (
                  <option key={idx} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* Taluka */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Taluka <span className="text-red-600">*</span>
              </label>
              <select
                name="taluka"
                value={fpsData.address.taluka}
                onChange={(e) =>
                  setFpsData({
                    ...fpsData,
                    address: { ...fpsData.address, taluka: e.target.value },
                  })
                }
                className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                required
              >
                <option value="Select Taluka">Select Taluka</option>
                {fpsData.address.district &&
                  MAHARASHTRA_TALUKAS[fpsData.address.district].map(
                    (taluka, idx) => (
                      <option key={idx} value={taluka}>
                        {taluka}
                      </option>
                    )
                  )}
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-gray-700 font-semibold">
                State <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={fpsData.address.state}
                disabled
                className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter state"
                required
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Pincode <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="pincode"
                value={fpsData.address.pincode}
                onChange={handleAddressChange}
                maxLength={6}
                className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter pincode"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full bg-green-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 ${
              disabled && "opacity-50 cursor-not-allowed"
            }`}
            disabled={disabled}
          >
            Register Fair Price Shop
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
              value={otp.otp}
              onChange={(e) => setOtp({ ...otp, otp: e.target.value })}
              placeholder="Enter OTP"
              className="w-50 rounded-sm border border-stroke bg-base-300 px-6 py-3 text-base-content outline-none transition-all duration-300 focus:border-primary"
            />
            <button
              type="button"
              className="w-50 rounded-sm border border-stroke bg-accent text-accent-content px-6 py-3 outline-none transition-all duration-300 focus:border-primary"
              onClick={() => {
                if (otp.otp === otp.otpSent) {
                  console.log(otp);
                  setOtp({ ...otp, isVerified: true });
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

export default FairPriceShopForm;
