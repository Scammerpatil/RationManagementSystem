"use client";
import RationCardDetails from "@/components/RationCardDetails";
import { useUser } from "@/context/UserContext";
import { RationCard } from "@/types/RationCard";
import { Tehsil } from "@/types/Tehsil";
import axios from "axios";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ApproveRationCardPage = () => {
  const [rationCardList, setRationCardList] = useState<RationCard[]>([]);
  const [rationCard, setRationCard] = useState<RationCard>();
  const [filter, setFilter] = useState<"Pending" | "Approved">("Pending");
  const { user } = useUser();

  useEffect(() => {
    console.log(user as Tehsil);
    if (user) {
      axios
        .post("/api/rationcard/getRationCardByTehsil", {
          taluka: (user as Tehsil).address.taluka,
        })
        .then((res) => {
          setRationCardList(res.data);
        });
    }
  }, [user]);

  const handleApproval = async (
    rationCardId: string,
    status: "Approved" | "Rejected"
  ) => {
    try {
      const response = axios.put(`/api/rationcard/approveRationCard`, {
        rationCardId,
        status,
      });
      toast.promise(response, {
        loading: "Updating Ration Card...",
        success: `Ration Card ${status}`,
        error: (e) => {
          return e.response.data.message;
        },
      });
      setRationCardList((prevList) =>
        prevList.map((card) =>
          card._id === rationCardId ? { ...card, status } : card
        )
      );
    } catch (error) {
      console.error("Failed to update ration card status", error);
    }
  };

  // Filter ration cards based on the selected filter state
  const filteredRationCardList = rationCardList.filter((card) => {
    if (filter === "Pending") {
      return !card.isAdminApproved && card.status !== "Rejected";
    } else if (filter === "Approved") {
      return card.isAdminApproved;
    }
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Approve Ration Cards</h1>

      {/* Filter buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${
            filter === "Pending" ? "bg-orange-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("Pending")}
        >
          Show Pending
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            filter === "Approved" ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("Approved")}
        >
          Show Approved
        </button>
      </div>

      {filteredRationCardList.length === 0 ? (
        <p className="text-gray-600">
          No {filter.toLowerCase()} ration cards available.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ration Card Number
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Card Type
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Head of Family
                </th>
                {/* <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th> */}
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  View
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRationCardList.map((card) => (
                <tr key={card.rationCardNumber}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {card.rationCardNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {card.cardType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {card.head?.fullName || "N/A"}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {card.status}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {!card.isAdminApproved && card.status !== "Rejected" ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproval(card._id, "Approved")}
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproval(card._id, "Rejected")}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span>{card.status}</span>
                    )}
                  </td>
                  <td className="flex items-center justify-center h-20">
                    <button
                      onClick={() => {
                        setRationCard(card);
                        document
                          .getElementById("rationCardDetails")
                          .showModal();
                      }}
                    >
                      <Eye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {rationCard && <RationCardDetails rationCard={rationCard} />}
    </div>
  );
};

export default ApproveRationCardPage;
