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

interface StockItem {
  wheat: number;
  rice: number;
  bajra: number;
  sugar: number;
  corn: number;
  oil: number;
  [key: string]: number;
}

export default function DistributeStockPage() {
  const [admin, setAdmin] = useState({
    remainingStock: {
      wheat: 0,
      rice: 0,
      bajra: 0,
      sugar: 0,
      corn: 0,
      oil: 0,
    },
    stock: {
      wheat: 99999,
      rice: 99999,
      bajra: 99999,
      sugar: 99999,
      corn: 99999,
      oil: 99999,
    },
  });
  const [tehsil, setTehsil] = useState<Tehsil[] | undefined>(undefined);
  useEffect(() => {
    const response = axios.get("/api/tehsil");
    response.then((res) => {
      setTehsil(res.data);
    });
  }, []);

  const handleDistributeStock = async (tehsil: Tehsil) => {
    const response = axios.post("/api/tehsil/distribute-stock", {
      tehsilId: tehsil._id,
    });
    toast.promise(response, {
      loading: "Distributing Stock....",
      success: "Stock Distributed Successfully",
      error: "Failed to Distribute Stock",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Admin Stock Distribution</h1>
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
              <td className="p-3">{admin.stock?.wheat || 0} Kg</td>
              <td className="p-3">{admin.stock?.rice || 0} Kg</td>
              <td className="p-3">{admin.stock?.sugar || 0} Kg</td>
              <td className="p-3">{admin.stock?.corn || 0} Kg</td>
              <td className="p-3">{admin.stock?.oil || 0} Ltr</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-base border border-cyan-700">
          <thead className="bg-base-200">
            <tr className="text-base text-base-content">
              <th>Tehsil Name</th>
              <th>Remaining Stock</th>
              <th>Required Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tehsil?.map((tehsil: Tehsil) => (
              <tr key={tehsil.tehsilUserId}>
                <td className="capitalize">{tehsil.taluka}</td>
                <td>
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
                        <td>{tehsil.remainingStock?.wheat || 0} Kg</td>
                      </tr>
                      <tr>
                        <td>Bajra</td>
                        <td>{tehsil.remainingStock?.bajra || 0} Kg</td>
                      </tr>
                      <tr>
                        <td>Sugar</td>
                        <td>{tehsil.remainingStock?.sugar || 0} Kg</td>
                      </tr>
                      <tr>
                        <td>Corn</td>
                        <td>{tehsil.remainingStock?.corn || 0} Kg</td>
                      </tr>
                      <tr>
                        <td>Oil</td>
                        <td>{tehsil.remainingStock?.oil || 0} L</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td>
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
                          {tehsil.stock?.wheat -
                            (tehsil.remainingStock?.wheat || 0) || "N/A"}{" "}
                          Kg
                        </td>
                      </tr>
                      <tr>
                        <td>Bajra</td>
                        <td>
                          {tehsil.stock?.bajra -
                            (tehsil.remainingStock?.bajra || 0) || "N/A"}{" "}
                          Kg
                        </td>
                      </tr>
                      <tr>
                        <td>Sugar</td>
                        <td>
                          {tehsil.stock?.sugar -
                            (tehsil.remainingStock?.sugar || 0) || "N/A"}{" "}
                          Kg
                        </td>
                      </tr>
                      <tr>
                        <td>Corn</td>
                        <td>
                          {tehsil.stock?.corn -
                            (tehsil.remainingStock?.corn || 0) || "N/A"}{" "}
                          Kg
                        </td>
                      </tr>
                      <tr>
                        <td>Oil</td>
                        <td>
                          {tehsil.stock?.oil -
                            (tehsil.remainingStock?.oil || 0) || "N/A"}{" "}
                          L
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleDistributeStock(tehsil)}
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
}
