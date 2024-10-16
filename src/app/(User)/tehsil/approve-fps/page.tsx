"use client";
import FPSDetails from "@/components/FPSDetails";
import useUser from "@/hooks/useUser";
import { FairPriceShop } from "@/types/FPS";
import axios from "axios";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const VerifyFPSPage = () => {
  const [fpsList, setFPSList] = useState<FairPriceShop[]>([]);
  const [tehsil, setTehsil] = useState("");
  const [fps, setFPS] = useState<FairPriceShop>();
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
        .post("/api/fps/getFPSByTehsil", {
          taluka: tehsil.address.taluka,
        })
        .then((res) => {
          setFPSList(res.data);
        });
    }
  }, [tehsil]);

  const handleApproval = async (
    fpsId: string,
    status: "Approved" | "Rejected"
  ) => {
    try {
      const response = axios.put(`/api/fps/approveFPS`, {
        fpsId,
        status,
      });
      toast.promise(response, {
        loading: "Updating FPS status...",
        success: "FPS Approved",
        error: (e) => {
          return e.response.data.message;
        },
      });
      setFPSList((prevList) =>
        prevList.map((shop) =>
          shop._id === fpsId ? { ...shop, status } : shop
        )
      );
    } catch (error) {
      console.error("Failed to update FPS status", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Verify FPS (Fair Price Shops)
      </h1>
      {fpsList.length === 0 ? (
        <p className="text-gray-600">No pending FPS for verification.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  FPS ID
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  FPS Name
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
              {fpsList.map((shop) => (
                <tr key={shop._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {shop.fpsUserId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {shop.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {shop.isAdminApproved ? "Approved" : "Pending"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {!shop.isAdminApproved ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproval(shop._id, "Approved")}
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproval(shop._id, "Rejected")}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span>{shop.isAdminApproved}</span>
                    )}
                  </td>
                  <td className="flex items-center justify-center h-20">
                    <button
                      onClick={() => {
                        setFPS(shop);
                        (
                          document.getElementById(
                            "fpsDetails"
                          ) as HTMLDialogElement
                        ).showModal();
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
      {fps && <FPSDetails fps={fps} />}
    </div>
  );
};

export default VerifyFPSPage;
