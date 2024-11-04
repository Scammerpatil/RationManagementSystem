"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Transaction } from "@/types/Inventory";
import { useUser } from "@/context/UserContext";
import SideNavSkeleton from "@/components/PageSkeleton";

const Inventory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const transactionsRes = await axios.post("/api/inventory/transactions");

        setTransactions(transactionsRes.data);
      } catch (error) {
        console.error("Error fetching inventory data", error);
      }
    };

    fetchInventoryData();
  }, []);
  if (!user) return <SideNavSkeleton />;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Inventory Overview</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Remaining Stocks</h2>
        <table className="min-w-full border border-gray-300 bg-white shadow-md">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left font-semibold">Items</th>
              <th className="p-3 text-left font-semibold">Wheat</th>
              <th className="p-3 text-left font-semibold">Rice</th>
              <th className="p-3 text-left font-semibold">Bajra</th>
              <th className="p-3 text-left font-semibold">Sugar</th>
              <th className="p-3 text-left font-semibold">Corn</th>
              <th className="p-3 text-left font-semibold">Oil</th>
            </tr>
          </thead>
          <tbody>
            <tr key={user._id} className="border-b">
              <td className="p-3">Stock</td>
              <td className="p-3">{user.remainingStock.wheat} Kg</td>
              <td className="p-3">{user.remainingStock.rice} Kg</td>
              <td className="p-3">{user.remainingStock.bajra} Kg</td>
              <td className="p-3">{user.remainingStock.sugar} Kg</td>
              <td className="p-3">{user.remainingStock.corn} Kg</td>
              <td className="p-3">{user.remainingStock.oil} Ltr</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Previous Transactions Table */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Previous Transactions</h2>
        <table className="min-w-full border border-gray-300 bg-white shadow-md">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left font-semibold">Date</th>
              <th className="p-3 text-left font-semibold">Item</th>
              <th className="p-3 text-left font-semibold">Quantity</th>
              <th className="p-3 text-left font-semibold">Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="p-3">{transaction.item}</td>
                <td className="p-3">{transaction.quantity}</td>
                <td className="p-3">{transaction.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
