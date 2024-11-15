"use client";
import React, { useState } from "react";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import SideNavSkeleton from "@/components/PageSkeleton";
import { FairPriceShop } from "@/types/FPS";
import { RationCard } from "@/types/RationCard";
import toast from "react-hot-toast";

const DistributeStock: React.FC = () => {
  const { user } = useUser() as unknown as {
    user: FairPriceShop;
  };

  const distributeStock = async (rationCard: RationCard) => {
    try {
      const data = axios.post("/api/user/distribute-stock", {
        fpsId: user._id,
        rationCardId: rationCard._id,
        requiredStock: rationCard.stock,
      });
      toast.promise(data, {
        loading: "Distributing stock...",
        success: "Stock distributed successfully",
        error: "Error distributing stock",
      });
    } catch (error: any) {
      console.error("Error distributing stock:", error);
    }
  };

  if (!user) return <SideNavSkeleton />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Distribute Stock</h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full border border-gray-200">
          <thead>
            <tr>
              <th className="p-4 text-left">Ration Card ID</th>
              <th className="p-4 text-left">Cardholder Name</th>
              <th className="p-4 text-left">Total Members</th>
              <th className="p-4 text-left">Required Stock</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {user.rationUnder.map((card: RationCard) => (
              <tr key={card._id} className="">
                <td className="p-4">{card.rationCardNumber}</td>
                <td className="p-4">{card.head.fullName}</td>
                <td className="p-4">{card.members.length + 1}</td>
                <td className="p-4">
                  <div className="overflow-x-auto">
                    <table className="table table-compact w-full bg-gray-50">
                      <thead>
                        <tr>
                          <th className="p-2 text-left">Item</th>
                          <th className="p-2 text-left">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2">Wheat</td>
                          <td className="p-2">{card.stock.wheat}</td>
                        </tr>
                        <tr>
                          <td className="p-2">Bajra</td>
                          <td className="p-2">{card.stock.bajra}</td>
                        </tr>
                        <tr>
                          <td className="p-2">Rice</td>
                          <td className="p-2">{card.stock.rice}</td>
                        </tr>
                        <tr>
                          <td className="p-2">Sugar</td>
                          <td className="p-2">{card.stock.sugar}</td>
                        </tr>
                        <tr>
                          <td className="p-2">Corn</td>
                          <td className="p-2">{card.stock.corn}</td>
                        </tr>
                        <tr>
                          <td className="p-2">Oil</td>
                          <td className="p-2">{card.stock.oil}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
                <td className="p-4">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => distributeStock(card)}
                  >
                    Distribute
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DistributeStock;
