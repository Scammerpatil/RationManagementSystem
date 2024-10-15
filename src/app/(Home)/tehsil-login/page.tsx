"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { EyeOff, Eye } from "lucide-react";

const TehsilLogin = () => {
  const [formData, setFormData] = useState({
    tehsilId: "",
    password: "",
  });
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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
    if (formData.tehsilId.length >= 6 && formData.password) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [captcha, captchaInput, formData]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (captcha !== captchaInput) {
      toast.error("Invalid Captcha");
      return;
    }
    submitForm();
  };

  const submitForm = () => {
    const data = {
      tehsilUserId: formData.tehsilId,
      password: formData.password,
    };

    const response = axios.post("/api/tehsil/tehsil-login", data);
    toast.promise(response, {
      loading: "Logging in...",
      success: (data) => {
        const user = data.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        router.push("/tehsil/dashboard");
        return data.data.message;
      },
      error: (error) => {
        return error.response.data.message;
      },
    });
  };

  return (
    <>
      <div className="max-w-md mx-auto p-8 bg-gradient-to-br from-gray-100 to-gray-300 shadow-lg rounded-lg my-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">
          Login For Tehsil
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Tehsil ID
            </label>
            <input
              type="text"
              name="tehsilId"
              value={formData.tehsilId}
              onChange={(e) => {
                setFormData({ ...formData, tehsilId: e.target.value });
              }}
              className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
              placeholder="Enter your Tehsil ID"
              required
            />
          </div>

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
    </>
  );
};

export default TehsilLogin;
