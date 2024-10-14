"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { EyeOff, Eye } from "lucide-react";

const PublicLogin = () => {
  const [loginMethod, setLoginMethod] = useState<"aadhaar" | "rationNumber">(
    "aadhaar"
  );
  const [formData, setFormData] = useState({
    aadhaar: "",
    rationNumber: "",
    password: "",
    otp: "",
  });
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility toggle
  const router = useRouter();

  // Generate Captcha
  const generateCaptcha = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  useEffect(() => {
    if (
      captcha === captchaInput &&
      (formData.aadhaar.length === 12 || formData.rationNumber.length === 12)
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [captcha, captchaInput, formData]);

  // Handle input changes
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle login method switching
  const handleLoginMethodSwitch = (method: "aadhaar" | "rationNumber") => {
    setLoginMethod(method);
    setFormData({
      ...formData,
      [method === "aadhaar" ? "rationNumber" : "aadhaar"]: "",
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (captcha !== captchaInput) {
      toast.error("Invalid Captcha");
      return;
    }
    if (loginMethod === "aadhaar" && formData.aadhaar.length !== 12) {
      toast.error("Invalid Aadhaar Number");
      return;
    }
    if (loginMethod === "rationNumber" && formData.rationNumber.length !== 12) {
      toast.error("Invalid Ration Card Number");
      return;
    }

    const otp = axios.post(
      "/api/auth/send-otp-by-aadhar",
      formData.aadhaar || formData.rationNumber
    );

    toast.promise(otp, {
      loading: "Sending OTP...",
      success: (data) => {
        setOtpSent(data.data.token);
        (
          document.getElementById("otpContainer") as HTMLDialogElement
        ).showModal();
        return "OTP Sent Successfully";
      },
      error: "Failed to send OTP",
    });
  };

  const submitForm = () => {
    const data = {
      aadhaar: formData.aadhaar,
      rationNumber: formData.rationNumber,
      password: formData.password,
    };

    const response = axios.post("/api/auth/user-login", data);
    toast.promise(response, {
      loading: "Logging in...",
      success: (data) => {
        const user = data.data.rationCard;
        localStorage.setItem("user", JSON.stringify(user));
        router.push("/user/dashboard");
        return "Logged in successfully";
      },
      error: "Failed to login",
    });
  };

  return (
    <>
      <div className="max-w-md mx-auto p-8 bg-gradient-to-br from-gray-100 to-gray-300 shadow-lg rounded-lg my-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">
          Login
        </h2>
        <div className="flex justify-center mb-6">
          <button
            onClick={() => handleLoginMethodSwitch("aadhaar")}
            className={`px-4 py-2 mx-2 rounded-lg font-semibold transition duration-300 ${
              loginMethod === "aadhaar"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Aadhaar Login
          </button>
          <button
            onClick={() => handleLoginMethodSwitch("rationNumber")}
            className={`px-4 py-2 mx-2 rounded-lg font-semibold transition duration-300 ${
              loginMethod === "rationNumber"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Ration Number Login
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {loginMethod === "aadhaar" && (
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Aadhaar Number
              </label>
              <input
                type="text"
                name="aadhaar"
                value={formData.aadhaar}
                maxLength={12}
                onChange={handleInputChange}
                className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter your Aadhaar Number"
                required
              />
            </div>
          )}

          {loginMethod === "rationNumber" && (
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Ration Card Number
              </label>
              <input
                type="text"
                name="rationNumber"
                value={formData.rationNumber}
                onChange={handleInputChange}
                className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter Your Ration Card Number"
                required
              />
            </div>
          )}

          {/* Password input with toggle */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="mt-2 p-3 pr-10 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
                placeholder="Enter Password"
                required
              />
              {/* Eye/EyeOff icon toggle */}
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          {/* Captcha input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Captcha</label>
            <input
              type="text"
              name="captchaInput"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
              placeholder="Enter the Captcha"
              required
            />
            <div className="mt-2 p-2 bg-gray-300 text-black rounded text-center font-bold text-lg">
              {captcha}
            </div>
          </div>

          <button
            type="submit"
            className={`w-full bg-indigo-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-indigo-600 transition duration-300 mb-2 ${
              disabled && "opacity-50 cursor-not-allowed"
            }`}
            disabled={disabled}
          >
            Submit
          </button>
        </form>
      </div>

      <dialog id="otpContainer" className="modal modal-bottom sm:modal-middle">
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
                  toast.success("OTP Verified Successfully");
                  (
                    document.getElementById("otpContainer") as HTMLDialogElement
                  ).close();
                  submitForm();
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

export default PublicLogin;
