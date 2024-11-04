"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import SideNavSkeleton from "@/components/PageSkeleton";
import { RationCard } from "@/types/RationCard";
import { FairPriceShop } from "@/types/FPS";
import { Transaction } from "@/types/Transaction";

const TehsilDashboard: React.FC = () => {
  const [pendingRationCard, setPendingRationCard] = useState<RationCard[]>([]);
  const [rationCard, setRationCard] = useState<RationCard[]>([]);
  const [fpsApprovals, setFpsApprovals] = useState<FairPriceShop[]>([]);
  const [stock, setStock] = useState({
    wheat: 999999,
    rice: 999999,
    sugar: 999999,
    bajra: 999999,
    oil: 999999,
    corn: 999999,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );

  const { user } = useUser();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const rationCardData = await axios.post(
          "/api/rationcard/getRationCardByTehsil",
          { taluka: user.taluka }
        );
        const fpsData = await axios.post("/api/fps/getFPSByTehsil", {
          taluka: user.taluka,
        });

        setRationCard(rationCardData.data);
        setPendingRationCard(
          rationCardData.data.filter(
            (card: RationCard) => !card.isAdminApproved
          )
        );
        setFpsApprovals(
          fpsData.data.filter((fps: FairPriceShop) => !fps.isAdminApproved)
        );
        setRecentTransactions(user?.transactions);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

  if (!user) return <SideNavSkeleton />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Tehsil Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h3 className="text-lg font-semibold">
            Pending Ration Card Approvals
          </h3>
          <p className="text-2xl font-bold">{pendingRationCard.length}</p>
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h3 className="text-lg font-semibold">Pending FPS Approvals</h3>
          <p className="text-2xl font-bold">{fpsApprovals.length}</p>
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h3 className="text-lg font-semibold">Stock Available</h3>
          <p className="text-2xl font-bold">
            {stock.wheat + stock.rice + stock.sugar + stock.bajra + stock.oil}
          </p>
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <p className="text-2xl font-bold">{recentTransactions.length}</p>
        </div>
      </div>

      {/* Approvals Tables */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Pending Ration Card Approvals
        </h2>
        <table className="min-w-full bg-white border border-gray-300 shadow-md">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left font-semibold">ID</th>
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">Aaahar Card No.</th>
              <th className="p-3 text-left font-semibold">Taluka</th>
              <th className="p-3 text-left font-semibold">District</th>
              <th className="p-3 text-left font-semibold">Family Members</th>
              <th className="p-3 text-left font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {pendingRationCard.length > 0 ? (
              pendingRationCard.map((approval: RationCard) => (
                <tr key={approval._id} className="border-b">
                  <td className="p-3">{approval.rationCardNumber}</td>
                  <td className="p-3">{approval.head.fullName}</td>
                  <td className="p-3">{approval.head.aadharNumber}</td>
                  <td className="p-3">{approval.address.taluka}</td>
                  <td className="p-3">{approval.address.district}</td>
                  <td className="p-3">{approval.members.length}</td>
                  <td className="p-3">{approval.createdAt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-3 text-center">
                  No pending Ration Card approvals
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Pending FPS Approvals</h2>
        <table className="min-w-full bg-white border border-gray-300 shadow-md">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left font-semibold">ID</th>
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {fpsApprovals.length > 0 ? (
              fpsApprovals.map((approval: FairPriceShop) => (
                <tr key={approval._id} className="border-b">
                  <td className="p-3">{approval.fpsUserId}</td>
                  <td className="p-3">{approval.fullName}</td>
                  <td className="p-3">{approval.pincode}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-3 text-center">
                  No pending FPS approvals
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stock Status Table */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Stock Status</h2>
        <table className="min-w-full bg-white border border-gray-300 shadow-md">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left font-semibold">Item</th>
              <th className="p-3 text-left font-semibold">Wheat</th>
              <th className="p-3 text-left font-semibold">Rice</th>
              <th className="p-3 text-left font-semibold">Sugar</th>
              <th className="p-3 text-left font-semibold">Corn</th>
              <th className="p-3 text-left font-semibold">Oil</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3">Stock</td>
              <td className="p-3">{stock.wheat} Kg</td>
              <td className="p-3">{stock.rice} Kg</td>
              <td className="p-3">{stock.sugar} Kg</td>
              <td className="p-3">{stock.corn} Kg</td>
              <td className="p-3">{stock.oil} Ltr</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Recent Transactions Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <table className="min-w-full bg-white border border-gray-300 shadow-md">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left font-semibold">ID</th>
              <th className="p-3 text-left font-semibold">Type</th>
              <th className="p-3 text-left font-semibold">Amount</th>
              <th className="p-3 text-left font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <tr key={transaction._id} className="border-b">
                  <td className="p-3">{transaction.stock.toString()}</td>
                  <td className="p-3">{transaction.receiverId}</td>
                  <td className="p-3">{transaction.senderId}</td>
                  <td className="p-3">{transaction.receiverType}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-3 text-center">
                  No recent transactions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TehsilDashboard;
