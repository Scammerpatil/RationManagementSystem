"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { Tehsil } from "@/types/Tehsil";
import { FairPriceShop } from "@/types/FPS";
import TableSkeleton from "@/components/TableSkeleton";
import { RationCard } from "@/types/RationCard";
import { ObjectId } from "mongoose";
import SideNavSkeleton from "@/components/PageSkeleton";
import toast from "react-hot-toast";

// Define StockItem interface for different stock types
interface StockItem {
  wheat: number;
  rice: number;
  bajra: number;
  sugar: number;
  corn: number;
  oil: number;
  [key: string]: number;
}

// Define interface for RationCard details
interface RationCardDetails extends RationCard {
  remainingStock: StockItem;
}

// Props for the main component
export default function DistributeStockPage() {
  const { user } = useUser() as { user: Tehsil | null };
  const [selectedFPS, setSelectedFPS] = useState<ObjectId | null>(null);
  const handleViewFPS = (fpsId: ObjectId) => {
    setSelectedFPS(fpsId === selectedFPS ? null : fpsId);
  };

  const handleDistributeStock = async (fpsId: string, fps: FairPriceShop) => {
    try {
      const requiredStock = {
        wheat: fps.stock.wheat - (fps.remainingStock?.wheat || 0),
        bajra: fps.stock.bajra - (fps.remainingStock?.bajra || 0),
        sugar: fps.stock.sugar - (fps.remainingStock?.sugar || 0),
        corn: fps.stock.corn - (fps.remainingStock?.corn || 0),
        oil: fps.stock.oil - (fps.remainingStock?.oil || 0),
        rice: fps.stock.rice - (fps.remainingStock?.rice || 0),
      };
      const response = axios.post(`/api/fps/distribute-stock`, {
        tehsilId: user?._id,
        fpsId: fps._id,
        requiredStock,
      });
      toast.promise(response, {
        loading: "Distributing stock...",
        success: "Stock distributed successfully",
        error: "Failed to distribute stock",
      });
    } catch (err) {}
  };
  if (!user) return <SideNavSkeleton />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Tehsil Stock Distribution</h1>
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
              <th className="p-3 text-left font-semibold">Bajra</th>
              <th className="p-3 text-left font-semibold">Oil</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3">Stock</td>
              <td className="p-3">{user.remainingStock?.wheat || 0} Kg</td>
              <td className="p-3">{user.remainingStock?.rice || 0} Kg</td>
              <td className="p-3">{user.remainingStock?.sugar || 0} Kg</td>
              <td className="p-3">{user.remainingStock?.corn || 0} Kg</td>
              <td className="p-3">{user.remainingStock?.bajra || 0} Kg</td>
              <td className="p-3">{user.remainingStock?.oil || 0} Ltr</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="overflow-x-auto">
        {user && (
          <table className="table table-zebra w-full text-base border border-cyan-700">
            <thead className="bg-base-200">
              <tr className="text-base text-base-content">
                <th>FPS Name</th>
                <th>Remaining Stock</th>
                <th>Required Stock</th>
                <th>Action</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {user.fpsShopUnder.map((fps: FairPriceShop) => (
                <tr key={fps.fpsUserId}>
                  <td>{fps.fullName}</td>
                  <td>
                    {/* Display remaining stock items */}
                    <table className="table w-full table-zebra text-base">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Remaining Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Wheat</td>
                          <td>{fps.remainingStock?.wheat || 0} Kg</td>
                        </tr>
                        <tr>
                          <td>Bajra</td>
                          <td>{fps.remainingStock?.bajra || 0} Kg</td>
                        </tr>
                        <tr>
                          <td>Sugar</td>
                          <td>{fps.remainingStock?.sugar || 0} Kg</td>
                        </tr>
                        <tr>
                          <td>Corn</td>
                          <td>{fps.remainingStock?.corn || 0} Kg</td>
                        </tr>
                        <tr>
                          <td>Oil</td>
                          <td>{fps.remainingStock?.oil || 0} L</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td>
                    {/* Calculate required stock based on remaining and stock */}
                    <table className="table w-full table-zebra text-base">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Required Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Wheat</td>
                          <td>
                            {fps.stock?.wheat -
                              (fps.remainingStock?.wheat || 0) || "N/A"}{" "}
                            Kg
                          </td>
                        </tr>
                        <tr>
                          <td>Bajra</td>
                          <td>
                            {fps.stock?.bajra -
                              (fps.remainingStock?.bajra || 0) || "N/A"}{" "}
                            Kg
                          </td>
                        </tr>
                        <tr>
                          <td>Sugar</td>
                          <td>
                            {fps.stock?.sugar -
                              (fps.remainingStock?.sugar || 0) || "N/A"}{" "}
                            Kg
                          </td>
                        </tr>
                        <tr>
                          <td>Corn</td>
                          <td>
                            {fps.stock?.corn -
                              (fps.remainingStock?.corn || 0) || "N/A"}{" "}
                            Kg
                          </td>
                        </tr>
                        <tr>
                          <td>Oil</td>
                          <td>
                            {fps.stock?.oil - (fps.remainingStock?.oil || 0) ||
                              "N/A"}{" "}
                            L
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() =>
                        handleDistributeStock(fps._id as string, fps)
                      }
                    >
                      Distribute
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleViewFPS(fps._id)}
                    >
                      {selectedFPS === fps._id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedFPS && (
        <div className="mt-6 overflow-x-scroll">
          <h2 className="text-xl font-semibold mb-2">FPS Details</h2>
          <table className="table w-full table-zebra text-base">
            <thead className="bg-base-200">
              <tr>
                <th>Ration Card No.</th>
                <th>Total Members</th>
                <th>Aadhar Card Numbers</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {user.fpsShopUnder
                .find((fps) => fps._id === selectedFPS)
                ?.rationUnder.map((rationCard) => (
                  <tr key={rationCard.rationCardNumber}>
                    <td>{rationCard.rationCardNumber}</td>
                    <td>{rationCard.members.length + 1}</td>
                    <td>
                      <ul>
                        {rationCard.members.map((member) => (
                          <li key={member.aadharNumber}>
                            {member.fullName} - {member.aadharNumber}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>{rationCard.address.street}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
