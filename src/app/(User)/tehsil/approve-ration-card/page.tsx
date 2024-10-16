"use client";
import RationCardDetails from "@/components/RationCardDetails";
import useUser from "@/hooks/useUser";
import { RationCard } from "@/types/RationCard";
import axios from "axios";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ApproveRationCardPage = () => {
  const [rationCardList, setRationCardList] = useState<RationCard[]>([]);
  const [tehsil, setTehsil] = useState("");
  const [rationCard, setRationCard] = useState<RationCard>();
  const user = useUser();

  useEffect(() => {
    if (user) {
      axios
        .post("/api/tehsil/getTehsil", { tehsilId: user.tehsilId })
        .then((res) => {
          setTehsil(res.data);
        });
    }
  }, [user]);

  useEffect(() => {
    if (tehsil) {
      axios
        .post("/api/rationcard/getRationCardByTehsil", {
          taluka: tehsil.address.taluka,
        })
        .then((res) => {
          setRationCardList(res.data);
        });
    }
  }, [tehsil]);

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
        success: "Ration Card Approved",
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Approve Ration Cards</h1>
      {rationCardList.length === 0 ? (
        <p className="text-gray-600">No pending ration cards for approval.</p>
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
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  View
                </th>
              </tr>
            </thead>
            <tbody>
              {rationCardList.map((card) => (
                <tr key={card._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {card.rationCardNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {card.cardType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {card.head?.fullName || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {card.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {!card.isAdminApproved ? (
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
