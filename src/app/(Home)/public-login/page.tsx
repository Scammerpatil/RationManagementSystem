"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  InputHTMLAttributes,
  ReactEventHandler,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { EyeOff, Eye } from "lucide-react";
import { useUser } from "@/context/UserContext";

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
  const [otpSent, setOtpSent] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Generate random Captcha
  const generateCaptcha = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: 6 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
  };

  useEffect(() => setCaptcha(generateCaptcha()), []);

  useEffect(() => {
    setDisabled(
      !(
        captcha === captchaInput &&
        (formData.aadhaar.length === 12 || formData.rationNumber.length === 12)
      )
    );
  }, [captcha, captchaInput, formData]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLoginMethodSwitch = (method: "aadhaar" | "rationNumber") => {
    setLoginMethod(method);
    setFormData((prevData) => ({
      ...prevData,
      [method === "aadhaar" ? "rationNumber" : "aadhaar"]: "",
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (captcha !== captchaInput) return toast.error("Invalid Captcha");

    const sendOtpRequest = axios.post("/api/auth/send-otp-by-aadhar", {
      aadhaar: formData.aadhaar || undefined,
      rationNumber: formData.rationNumber || undefined,
    });

    toast.promise(sendOtpRequest, {
      loading: "Sending OTP...",
      success: (res) => {
        setOtpSent(res.data.token);
        (
          document.getElementById("otpContainer") as HTMLDialogElement
        )?.showModal();
        return "OTP Sent Successfully";
      },
      error: (error) => error.response.data.message,
    });
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/auth/user-login", formData);
      localStorage.setItem("user", JSON.stringify(response.data.rationCard));
      router.push("/user/dashboard");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
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
            className={`px-4 py-2 mx-2 rounded-lg font-semibold ${
              loginMethod === "aadhaar"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Aadhaar Login
          </button>
          <button
            onClick={() => handleLoginMethodSwitch("rationNumber")}
            className={`px-4 py-2 mx-2 rounded-lg font-semibold ${
              loginMethod === "rationNumber"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Ration Number Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {loginMethod === "aadhaar" && (
            <InputField
              label="Aadhaar Number"
              name="aadhaar"
              value={formData.aadhaar}
              onChange={handleInputChange}
              maxLength={12}
            />
          )}
          {loginMethod === "rationNumber" && (
            <InputField
              label="Ration Card Number"
              name="rationNumber"
              value={formData.rationNumber}
              onChange={handleInputChange}
              maxLength={12}
            />
          )}

          {/* Password Input with toggle */}
          <PasswordInput
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            password={formData.password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          {/* Captcha Input */}
          <CaptchaInput
            captcha={captcha}
            captchaInput={captchaInput}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCaptchaInput(e.target.value)
            }
          />

          <button
            type="submit"
            className={`w-full bg-indigo-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-indigo-600 transition duration-300 ${
              disabled && "opacity-50 cursor-not-allowed"
            }`}
            disabled={disabled || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      {/* OTP Dialog */}
      <OTPDialog otpSent={otpSent} submitForm={submitForm} />
    </>
  );
};

export default PublicLogin;

const InputField = ({
  label,
  name,
  value,
  onChange,
  maxLength,
}: {
  label: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  maxLength: number;
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 font-semibold">{label}</label>
    <input
      className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
      name={name}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      placeholder={`Enter ${label}`}
      required
    />
  </div>
);

const PasswordInput = ({
  showPassword,
  setShowPassword,
  password,
  onChange,
}: {
  showPassword: boolean;
  password: string;
  onChange: ChangeEventHandler<HTMLInputElement> | undefined;
  setShowPassword: ReactEventHandler;
}) => (
  <div className="mb-4 relative">
    <label className="block text-gray-700 font-semibold">Password</label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={onChange}
        className="mt-2 p-3 pr-10 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
        placeholder="Enter Password"
        required
      />
      <span
        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-700"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </span>
    </div>
  </div>
);

const CaptchaInput = ({
  captcha,
  captchaInput,
  onChange,
}: {
  captcha: string;
  captchaInput: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 font-semibold">Captcha</label>
    <input
      type="text"
      value={captchaInput}
      onChange={onChange}
      className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
      placeholder="Enter the Captcha"
      required
    />
    <div className="mt-2 p-2 bg-gray-300 text-black rounded text-center font-bold text-lg">
      {captcha}
    </div>
  </div>
);

const OTPDialog = ({
  otpSent,
  submitForm,
}: {
  otpSent: string;
  submitForm: () => void;
}) => (
  <dialog id="otpContainer" className="modal modal-bottom sm:modal-middle">
    <div className="modal-box flex flex-col justify-center items-center gap-5">
      <h1 className="mt-5">Verify Your Email</h1>
      <label className="mb-3 block text-sm text-base-content">
        Please Enter the OTP
      </label>
      <input
        type="text"
        placeholder="Enter OTP"
        className="w-50 rounded-sm border border-stroke bg-base-300 px-6 py-3 text-base-content outline-none transition-all duration-300 focus:border-primary"
      />
      <button
        onClick={() => submitForm()}
        className="w-50 rounded-sm border border-stroke bg-accent text-accent-content px-6 py-3 outline-none transition-all duration-300 focus:border-primary"
      >
        Verify
      </button>
      <form method="dialog">
        <button className="btn btn-outline text-base-content">Close</button>
      </form>
    </div>
  </dialog>
);
