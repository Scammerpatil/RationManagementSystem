"use client";
import React, { useState } from "react";
import RationCard from "@/models/RationCard";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/router";

const ComplaintPage: React.FC = () => {
  const { user, userType } = useUser();
  //   const router = useRouter();
  console.log(user);

  // Fetch the RationCard ID from the user context (assuming user is of type RationCard)
  const rationCardId =
    user && userType === "RationCard"
      ? (user as RationCard).rationCardNumber
      : ""; // Safely access rationCardId if user is of type RationCard
  console.log(rationCardId);

  const [complaintType, setComplaintType] = useState<string>("Stock Issue"); // Default type
  const [description, setDescription] = useState<string>(""); // Description for 'Others'
  const [isOther, setIsOther] = useState<boolean>(false); // Flag to check if 'Others' is selected
  const [loading, setLoading] = useState<boolean>(false); // Loading state for submission

  // Handle the form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    console.log(rationCardId, complaintType, description);

    try {
      const response = await fetch("/api/user/add-complaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rationCardNumber: rationCardId,
          complaintType,
          description: isOther ? description : complaintType, // Use the description if 'Others' is selected
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit complaint");
      }

      alert("Complaint submitted successfully!");
      // router.push("/"); // Redirect to home or another page on success
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Complaint</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Complaint Type Dropdown */}
        <div className="form-group">
          <label
            htmlFor="complaintType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Complaint Type:
          </label>
          <select
            id="complaintType"
            value={complaintType}
            onChange={(e) => {
              setComplaintType(e.target.value);
              setIsOther(e.target.value === "Others");
            }}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Stock Issue">Stock Issue</option>
            <option value="Delivery Issue">Delivery Issue</option>
            <option value="Quality Issue">Quality Issue</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Conditional Input for 'Others' */}
        {isOther && (
          <div className="form-group">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Please describe the complaint:
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Enter your complaint"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="form-group">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md text-white font-semibold ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {loading ? "Submitting..." : "Add Complaint"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintPage;
