"use client";
import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { RationCard } from "@/types/RationCard";
import axios from "axios";
import toast from "react-hot-toast";
import { User } from "@/types/User";

const UpdateDetailsPage = () => {
  const { user } = useUser() as { user: RationCard };
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<User>({
    fullName: "",
    aadharNumber: "",
    dob: "",
    aadhaarFrontCardUrl: "",
    aadhaarBackCardUrl: "",
    mobileNumber: "",
    occupation: "",
    caste: "",
    income: 0,
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    email: "",
    gender: "",
    incomeProofUrl: "",
    isHead: false,
  });

  const handleEditToggle = (index: number, member: any) => {
    if (editingIndex === index) {
      setEditingIndex(null);
    } else {
      setEditingIndex(index);
      setFormData(member);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    console.log(formData);
    try {
      const response = axios.put(`/api/user/update`, { formData });
      toast.promise(response, {
        loading: "Updating details...",
        success: "Details updated successfully",
        error: "Failed to update details",
      });
      setEditingIndex(null);
    } catch (error) {
      toast.error("Failed to update details");
    }
  };

  const handleDelete = async (member: User) => {
    const response = axios.delete(`/api/user/delete`, {
      data: { member, user },
    });
    toast.promise(response, {
      loading: "Deleting member...",
      success: "Member deleted successfully",
      error: "Failed to delete member",
    });
  };

  return (
    <div className="p-5 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Family Members</h2>
      {user.members.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {user.members.map((member, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-md p-4 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">
                    {member.fullName || "Unnamed Member"}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {member.relationship || "Role Unspecified"}
                  </p>
                </div>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleEditToggle(index, member)}
                >
                  {editingIndex === index ? "Cancel" : "Edit"}
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => handleDelete(member)}
                >
                  Delete
                </button>
              </div>

              {editingIndex === index ? (
                <form className="mt-4 space-y-3">
                  {/* Non-editable fields */}
                  <div className="form-control">
                    <label className="label">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName || ""}
                      readOnly
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Aadhar Number</label>
                    <input
                      type="text"
                      name="aadharNumber"
                      value={formData.aadharNumber || ""}
                      readOnly
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Gender</label>
                    <input
                      type="text"
                      name="gender"
                      value={formData.gender || ""}
                      readOnly
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Aadhaar Front Card URL</label>
                    <input
                      type="text"
                      name="aadhaarFrontCardUrl"
                      value={formData.aadhaarFrontCardUrl || ""}
                      readOnly
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Aadhaar Back Card URL</label>
                    <input
                      type="text"
                      name="aadhaarBackCardUrl"
                      value={formData.aadhaarBackCardUrl || ""}
                      readOnly
                      className="input input-bordered"
                    />
                  </div>

                  {/* Editable fields */}
                  <div className="form-control">
                    <label className="label">Mobile Number</label>
                    <input
                      type="text"
                      name="mobileNumber"
                      value={formData.mobileNumber || ""}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Occupation</label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation || ""}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Caste</label>
                    <input
                      type="text"
                      name="caste"
                      value={formData.caste || ""}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Income</label>
                    <input
                      type="number"
                      name="income"
                      value={formData.income || ""}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName || ""}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">Account Number</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber || ""}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">IFSC Code</label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode || ""}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="btn btn-primary mt-4 w-full"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="mt-4 space-y-2">
                  <p>
                    <strong>Mobile Number:</strong>{" "}
                    {member.mobileNumber || "N/A"}
                  </p>
                  <p>
                    <strong>Occupation:</strong>{" "}
                    {member.occupation || "Unspecified"}
                  </p>
                  <p>
                    <strong>Caste:</strong> {member.caste || "Unspecified"}
                  </p>
                  <p>
                    <strong>Income:</strong>{" "}
                    {member.income ? `₹${member.income}` : "N/A"}
                  </p>
                  <p>
                    <strong>Bank Name:</strong> {member.bankName || "N/A"}
                  </p>
                  <p>
                    <strong>Account Number:</strong>{" "}
                    {member.accountNumber || "N/A"}
                  </p>
                  <p>
                    <strong>IFSC Code:</strong> {member.ifscCode || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {member.email || "N/A"}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong>{" "}
                    {member.dob.toLocaleString().split("T")[0] || "N/A"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No Members Added</p>
      )}
    </div>
  );
};

export default UpdateDetailsPage;
