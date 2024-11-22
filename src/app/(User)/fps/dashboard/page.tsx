"use client";
import axios from "axios";
import React from "react";
import { useUser } from "@/context/UserContext";
import { FairPriceShop } from "@/types/FPS";
import { RationCard } from "@/types/RationCard";
import toast from "react-hot-toast";
// Correct import from react-hot-toast

const FPSDashboard = () => {
  const { user } = useUser() as unknown as {
    user: FairPriceShop;
  };

  const sendEmails = async () => {
    try {
      // Collect all ration card IDs and email the heads of families
      const rationCardNumbers = user.rationUnder.map(
        (card: RationCard) => card.rationCardNumber
      );

      // Send the ration card numbers to the backend for processing
      const response = await axios.post("/api/fps/send-mail-to-head", {
        rationCardNumbers,
      });

      if (response.data.success) {
        // Show success toast
        toast.success(
          "Emails sent successfully to the ration card heads of families."
        );
      } else {
        // Show error toast
        toast.error("Failed to send emails. Please try again.");
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      // Show error toast
      toast.error("An error occurred while sending emails.");
    }
  };

  return (
    <>
      <div>
        <h1>FPS Dashboard</h1>
        <button
          onClick={sendEmails}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#324489",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Send Mails to Ration Card Holders
        </button>
      </div>

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Distribute Stock</h1>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full border border-gray-200">
            <thead>
              <tr>
                <th className="p-4 text-left">Ration Card ID</th>
                <th className="p-4 text-left">Cardholder Name</th>
                <th className="p-4 text-left">Total Members</th>
                <th className="p-4 text-left">Family Members</th>
              </tr>
            </thead>
            <tbody>
              {user.rationUnder.map((card: RationCard) => (
                <tr key={card._id}>
                  <td className="p-4">{card.rationCardNumber}</td>
                  <td className="p-4">{card.head.fullName}</td>
                  <td className="p-4">{card.members.length + 1}</td>
                  <td className="p-4">
                    <div className="overflow-x-auto">
                      <table className="table table-compact w-full bg-gray-50">
                        <thead>
                          <tr>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Relationship</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Render the head of the family */}
                          <tr>
                            <td className="p-2">{card.head.fullName}</td>
                            <td className="p-2">Head of Family</td>
                          </tr>
                          {/* Render other family members */}
                          {card.members.map((member) => (
                            <tr key={member._id}>
                              <td className="p-2">{member.fullName}</td>
                              <td className="p-2">{member.relationship}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FPSDashboard;
