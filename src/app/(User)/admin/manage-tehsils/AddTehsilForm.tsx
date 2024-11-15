import { MAHARASHTRA_DISTRICTS, MAHARASHTRA_TALUKAS } from "@/utils/Constants";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddTehsilForm = () => {
  const [tehsil, setTehsil] = useState({
    tehsilUserId: "",
    password: "",
    address: {
      street: "",
      district: "",
      taluka: "",
      state: "Maharashtra",
      pincode: "",
    },
  });

  useEffect(() => {
    const tehsilUserId = `MH-${tehsil.address.taluka.slice(0, 2)}-${
      tehsil.address.pincode
    }`.toUpperCase();
    setTehsil({ ...tehsil, tehsilUserId });
  }, [tehsil.address]);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = axios.post("/api/tehsil/tehsil-register", tehsil);
    toast.promise(response, {
      loading: "Creating Tehsil...",
      success: "Tehsil Created Successfully",
      error: "Failed to Create Tehsil",
    });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-10 rounded-lg shadow-lg max-w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Name of Head of Family */}
        <div>
          <label className="block text-gray-700 font-semibold">
            Tehsil User ID: <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={tehsil?.tehsilUserId}
            readOnly
            onChange={(e) =>
              setTehsil({ ...tehsil, tehsilUserId: e.target.value })
            }
            className="mt-2 p-3 block w-full border bg-gray-50 text-black border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Street Code */}
        <div>
          <label className="block text-gray-700 font-semibold">Street</label>
          <input
            type="text"
            name="Street"
            value={tehsil.address.street}
            onChange={(e) =>
              setTehsil({
                ...tehsil,
                address: { ...tehsil.address, street: e.target.value },
              })
            }
            className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
            placeholder="Enter Your Street Name"
          />
        </div>

        {/* District */}
        <div>
          <label className="block text-gray-700 font-semibold">District</label>
          <select
            name="District"
            value={tehsil.address.district}
            onChange={(e) =>
              setTehsil({
                ...tehsil,
                address: { ...tehsil.address, district: e.target.value },
              })
            }
            className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
          >
            <option value="">Select Districts</option>
            {MAHARASHTRA_DISTRICTS.map((district, idx) => (
              <option key={idx} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Taluka Code */}
        <div>
          <label className="block text-gray-700 font-semibold">Taluka</label>
          <select
            name="Taluka"
            value={tehsil.address.taluka}
            onChange={(e) =>
              setTehsil({
                ...tehsil,
                address: { ...tehsil.address, taluka: e.target.value },
              })
            }
            className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
          >
            <option value="Select Taluka">Select Taluka</option>
            {tehsil.address.district &&
              MAHARASHTRA_TALUKAS[tehsil.address.district].map(
                (taluka, idx) => (
                  <option key={idx} value={taluka}>
                    {taluka}
                  </option>
                )
              )}
          </select>
        </div>

        {/* State Code */}
        <div>
          <label className="block text-gray-700 font-semibold">State</label>
          <input
            name="State"
            value={tehsil.address.state}
            readOnly
            className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
          />
        </div>

        {/* Pin Code */}
        <div>
          <label className="block text-gray-700 font-semibold">Pin Code</label>
          <input
            type="text"
            name="Taluka"
            value={tehsil.address.pincode}
            maxLength={6}
            onChange={(e) =>
              setTehsil({
                ...tehsil,
                address: { ...tehsil.address, pincode: e.target.value },
              })
            }
            className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
            placeholder="Enter Pin Code"
          />
        </div>
        {/* Password */}
        <div className="relative">
          <label className="block text-gray-700 font-semibold">
            Password <span className="text-red-600">*</span>
          </label>
          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={tehsil.password}
              onChange={(e) =>
                setTehsil({ ...tehsil, password: e.target.value })
              }
              className="p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
              placeholder="Enter Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center justify-center h-full"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className={`w-full bg-green-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 `}
      >
        Submit Application
      </button>
    </form>
  );
};

export default AddTehsilForm;
