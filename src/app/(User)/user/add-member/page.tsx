"use client";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const AddFamilyMembers: React.FC = () => {
  const { user } = useUser();
  const [members, setMembers] = useState([
    {
      fullName: "",
      gender: "",
      relationship: "",
      aadharNumber: "",
      dob: "",
      email: "",
      mobileNumber: "",
      occupation: "",
      aadhaarFrontCardUrl: "",
      aadhaarBackCardUrl: "",
    },
  ]);

  const handleAddMember = () => {
    setMembers([
      ...members,
      {
        fullName: "",
        gender: "",
        relationship: "",
        aadharNumber: "",
        dob: "",
        email: "",
        mobileNumber: "",
        occupation: "",
        aadhaarFrontCardUrl: "",
        aadhaarBackCardUrl: "",
      },
    ]);
  };

  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [name]: value };
    setMembers(updatedMembers);
  };

  const handleFileChange = (
    index: number,
    name: "aadhaarFrontCardUrl" | "aadhaarBackCardUrl",
    file: File | null
  ) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", name.split("Url")[0]);
    if (members[index].aadharNumber === "")
      return toast.error("Please enter Aadhaar number first!");
    formData.append("aadharNumber", members[index].aadharNumber);

    toast.promise(axios.post("/api/helper/add-file", formData), {
      loading: "Uploading file...",
      success: (data: { data: { secure_url: string } }) => {
        const updatedMembers = [...members];
        console.log(data.data.secure_url);
        updatedMembers[index] = {
          ...updatedMembers[index],
          [name]: data.data.secure_url,
        };
        setMembers(updatedMembers);
        console.log(members);
        return "File uploaded successfully!";
      },
      error: "Failed to upload file!",
    });
  };

  const handleRemoveMember = (index: number) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      user,
      members,
    };
    const reponse = axios.post("/api/user/add-member", data);
    toast.promise(reponse, {
      loading: "Adding members...",
      success: "Members added successfully!",
      error: "Failed to add members!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8">
      <h2 className="text-4xl font-bold mb-8 text-center text-indigo-700">
        Add Family Members
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-lg shadow-lg max-w-full"
      >
        {members.map((member, index) => (
          <div key={index} className="mb-8 p-4 bg-gray-100 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Member {index + 1}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
              {/* Full Name */}
              <div>
                <label className="block text-gray-700 font-semibold">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={member.fullName}
                  onChange={(e) => handleInputChange(index, e)}
                  className="mt-2 p-3 block w-full border border-gray-300 bg-gray-50 text-black rounded-lg shadow-sm"
                  placeholder="Enter full name"
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
                  name="aadharNumber"
                  value={member.aadharNumber}
                  onChange={(e) => handleInputChange(index, e)}
                  className="mt-2 p-3 block w-full border border-gray-300 bg-gray-50 text-black rounded-lg shadow-sm"
                  placeholder="Enter Aadhaar number"
                  required
                  maxLength={12}
                  pattern="\d{12}"
                  title="Aadhaar number must be a 12-digit number"
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
                  value={member.dob}
                  onChange={(e) => handleInputChange(index, e)}
                  className="mt-2 p-3 block w-full border border-gray-300 bg-gray-50 text-black rounded-lg shadow-sm"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-semibold">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={member.email}
                  onChange={(e) => handleInputChange(index, e)}
                  className="mt-2 p-3 block w-full border border-gray-300 bg-gray-50 text-black rounded-lg shadow-sm"
                  placeholder="Enter email"
                  required
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-gray-700 font-semibold">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={member.mobileNumber}
                  onChange={(e) => handleInputChange(index, e)}
                  className="mt-2 p-3 block w-full border border-gray-300 bg-gray-50 text-black rounded-lg shadow-sm"
                  placeholder="Enter mobile number"
                  maxLength={10}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-gray-700 font-semibold">
                  Gender <span className="text-red-600">*</span>
                </label>
                <select
                  name="gender"
                  value={member.gender}
                  onChange={(e) => handleInputChange(index, e)}
                  className="mt-2 p-3 block w-full border border-gray-300 bg-gray-50 text-black rounded-lg shadow-sm"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Relationship */}
              <div>
                <label className="block text-gray-700 font-semibold">
                  Relationship to Head <span className="text-red-600">*</span>
                </label>
                <select
                  name="relationship"
                  value={member.relationship}
                  onChange={(e) => handleInputChange(index, e)}
                  className="mt-2 p-3 block w-full border border-gray-300 bg-gray-50 text-black rounded-lg shadow-sm"
                  required
                >
                  <option value="">Select Relationship</option>
                  <option value="son">Son</option>
                  <option value="daughter">Daughter</option>
                  <option value="spouse">Spouse</option>
                  <option value="brother">Brother</option>
                  <option value="sister">Sister</option>
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                </select>
              </div>

              {/* Occupation */}
              <div>
                <label className="block text-gray-700 font-semibold">
                  Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={member.occupation}
                  onChange={(e) => handleInputChange(index, e)}
                  className="mt-2 p-3 block w-full border border-gray-300 bg-gray-50 text-black rounded-lg shadow-sm"
                  placeholder="Enter occupation"
                />
              </div>

              {/* Aadhaar Front Card */}
              <div>
                <label className="block text-gray-700 font-semibold">
                  Aadhaar Front Card <span className="text-red-600">*</span>
                </label>
                <input
                  type="file"
                  name="aadharFrontCardUrl"
                  disabled={member.aadharNumber === "" ? true : false}
                  accept=".jpg, .jpeg, .png, .pdf"
                  onChange={(e) =>
                    handleFileChange(
                      index,
                      "aadhaarFrontCardUrl",
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                  className="mt-2 p-3 block w-full text-black bg-gray-50 border border-gray-300 rounded-lg shadow-sm"
                  required
                />
              </div>

              {/* Aadhaar Back Card */}
              <div>
                <label className="block text-gray-700 font-semibold">
                  Aadhaar Back Card <span className="text-red-600">*</span>
                </label>
                <input
                  disabled={member.aadharNumber === "" ? true : false}
                  type="file"
                  name="aadharBackCardUrl"
                  accept=".jpg, .jpeg, .png, .pdf"
                  onChange={(e) =>
                    handleFileChange(
                      index,
                      "aadhaarBackCardUrl",
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                  className="mt-2 p-3 block w-full text-black bg-gray-50 border border-gray-300 rounded-lg shadow-sm"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
              onClick={() => handleRemoveMember(index)}
            >
              Remove Member
            </button>
          </div>
        ))}

        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          onClick={handleAddMember}
        >
          Add Another Member
        </button>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-green-700 mt-8"
        >
          Submit Members
        </button>
      </form>
    </div>
  );
};

export default AddFamilyMembers;
