import { User } from "@/types/User";

const ApplicantDetails = ({ user }: { user: User }) => {
  return (
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
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
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
          value={formData.caste}
          onChange={handleInputChange}
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
          value={formData.mobile}
          maxLength={10}
          onChange={handleInputChange}
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
          value={formData.aadhaar}
          onChange={handleInputChange}
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
          value={formData.dob}
          onChange={handleInputChange} // Corrected to handleInputChange
          className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
          required
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
          value={formData.occupation}
          onChange={handleInputChange}
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
          value={formData.bankName}
          onChange={handleInputChange}
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
          value={formData.accountNumber}
          onChange={handleInputChange}
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
          value={formData.ifscCode}
          onChange={handleInputChange}
          className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
          placeholder="Enter IFSC code"
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
          value={formData.password}
          onChange={handleInputChange}
          className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
          placeholder="Enter Password"
        />
      </div>
      {/* Full Address */}
      <div className="col-span-2 lg:col-span-3">
        <label className="block text-gray-700 font-semibold">
          Full Address
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className="mt-2 p-3 block w-full bg-gray-50 text-black border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 transition duration-300"
          placeholder="Enter your address"
          required
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
          onChange={handleFileChange}
          className="mt-2 block w-full text-gray-700"
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
          onChange={handleFileChange}
          className="mt-2 block w-full text-gray-700"
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
          className="mt-2 block w-full text-gray-700"
        />
      </div>
    </div>
  );
};

export default ApplicantDetails;
