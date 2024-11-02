"use client";
import RationCardDetails from "@/components/RationCardDetails";
import FPSTableSkeleton from "@/components/TableSkeleton";
import { useUser } from "@/context/UserContext";
import { RationCard } from "@/types/RationCard";
import { Tehsil } from "@/types/Tehsil";
import axios from "axios";
import { Eye } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ApprovedRationCard from "./ApprovedRationCard";
import PendingRationCard from "./PendingRationCard";

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
    } catch (error) {
      console.error("Failed to update ration card status", error);
    }
  };

  // Filter ration cards based on the selected filter state
  const filteredRationCardList = rationCardList.filter((card) => {
    if (filter === "Pending") {
      return !card.isAdminApproved && card.status !== "Cancelled";
    } else if (filter === "Approved") {
      return card.isAdminApproved;
    }
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Approve Ration Cards</h1>
      <div
        role="tablist"
        className="tabs tabs-lifted bg-base-300 p-10 border-r-4 overflow-x-scroll"
      >
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab text-xl"
          aria-label="Approved"
          defaultChecked
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          <Suspense fallback={<FPSTableSkeleton />}>
            <ApprovedRationCard />
          </Suspense>
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab text-xl p-2"
          aria-label="Pending"
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          <PendingRationCard />
        </div>
      </div>
    </div>
  );
};

export default ApproveRationCardPage;
