"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { RationCard, StockRequirement } from "@/types/DistributeStock";
import { useUser } from "@/context/UserContext";
import SideNavSkeleton from "@/components/PageSkeleton";

const DistributeStock: React.FC = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const { user } = useUser();

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  if (!user) return <SideNavSkeleton />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Distribute Stock</h1>

      <table className="min-w-full border border-gray-300 bg-white shadow-md">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left font-semibold">Ration Card ID</th>
            <th className="p-3 text-left font-semibold">Cardholder Name</th>
            <th className="p-3 text-left font-semibold">Total Members</th>
            <th className="p-3 text-left font-semibold">Required Stock</th>
            <th className="p-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rationCards.map((card) => (
            <React.Fragment key={card.id}>
              <tr className="border-b">
                <td className="p-3">{card.id}</td>
                <td className="p-3">{card.cardholderName}</td>
                <td className="p-3">{card.totalMembers}</td>
                <td className="p-3">
                  {card.requiredStock.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}
                </td>
                <td className="p-3">
                  <button
                    className="text-blue-500"
                    onClick={() => toggleRowExpansion(card.id)}
                  >
                    {expandedRows.has(card.id)
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                </td>
              </tr>

              {/* Expandable row for nested stock requirements table */}
              {expandedRows.has(card.id) && (
                <tr>
                  <td colSpan={5} className="p-3 bg-gray-100">
                    <h3 className="text-lg font-semibold mb-2">
                      Required Stock Details
                    </h3>
                    <table className="min-w-full border border-gray-300 bg-white">
                      <thead>
                        <tr className="border-b">
                          <th className="p-2 text-left font-semibold">Item</th>
                          <th className="p-2 text-left font-semibold">
                            Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {card.requiredStock.map((stock, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{stock.item}</td>
                            <td className="p-2">{stock.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DistributeStock;
