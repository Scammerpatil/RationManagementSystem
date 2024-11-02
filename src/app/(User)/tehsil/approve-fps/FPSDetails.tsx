import FPSDetails from "@/components/FPSDetails";
import TableSkeleton from "@/components/TableSkeleton";
import { useUser } from "@/context/UserContext";
import { FairPriceShop } from "@/types/FPS";
import { Tehsil } from "@/types/Tehsil";
import axios from "axios";
import { ObjectId } from "mongoose";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Cached data and promise for fetching FPS list
let fpsListPromise: Promise<FairPriceShop[]> | null = null;
let cachedFPSList: FairPriceShop[] | null = null;

const fetchFPSList = async (taluka: string): Promise<FairPriceShop[]> => {
  if (cachedFPSList) return cachedFPSList;
  if (!fpsListPromise) {
    fpsListPromise = axios
      .post("/api/fps/getFPSByTehsil", { taluka })
      .then((res) => {
        cachedFPSList = res.data;
        return res.data;
      })
      .catch((error) => {
        console.error("Failed to fetch FPS list", error);
        return [];
      });
  }
  return fpsListPromise;
};

const FPSFetchData = () => {
  const [fpsList, setFPSList] = useState<FairPriceShop[]>([]);
  const [fps, setFPS] = useState<FairPriceShop>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const getFPSList = async () => {
      setLoading(true);
      setError(null);
      try {
        if (user) {
          const taluka = (user as Tehsil).address.taluka;
          const data = await fetchFPSList(taluka);
          setFPSList(data);
        }
      } catch (err) {
        console.error("Failed to fetch FPS list:", err);
        setError("Failed to fetch FPS list.");
      } finally {
        setLoading(false);
      }
    };
    getFPSList();
  }, [user]);

  const handleApproval = async (
    fpsId: ObjectId,
    status: "Approved" | "Rejected"
  ) => {
    try {
      const response = axios.put(`/api/fps/approveFPS`, {
        fpsId,
        status,
      });
      toast.promise(response, {
        loading: "Updating FPS status...",
        success: "FPS status updated",
        error: (e) => e.response?.data?.message || "An error occurred",
      });
      setFPSList((prevList) =>
        prevList.map((shop) =>
          shop._id === fpsId ? { ...shop, status } : shop
        )
      );
    } catch (error) {
      console.error("Failed to update FPS status", error);
      toast.error("Error updating FPS status");
    }
  };

  return (
    <div className="container mx-auto">
      <div className="overflow-x-auto">
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          <table className="table table-zebra w-full text-base">
            <thead className="bg-base-200">
              <tr className="text-base border border-cyan-700">
                <th>#</th>
                <th>FPS ID</th>
                <th>FPS Name</th>
                <th>Address</th>
                <th>Taluka</th>
                <th>District</th>
                <th>PinCode</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {fpsList.length > 0 ? (
                fpsList.map((shop, index) => (
                  <tr
                    key={shop._id.toString()}
                    className={
                      index % 2 === 0
                        ? "bg-gray-50 text-base border border-cyan-700"
                        : "bg-white"
                    }
                  >
                    <td>{index + 1}</td>
                    <td>{shop.fpsUserId}</td>
                    <td>{shop.fullName}</td>
                    <td>{shop.address.street}</td>
                    <td>{shop.address.taluka}</td>
                    <td>{shop.address.district}</td>
                    <td>{shop.address.pincode}</td>
                    <td>{shop.isAdminApproved ? "Approved" : "Pending"}</td>
                    <td>
                      {!shop.isAdminApproved ? (
                        <div>
                          <button
                            className="btn btn-sm btn-primary w-20 my-2"
                            onClick={() => handleApproval(shop._id, "Approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-error w-20"
                            onClick={() => handleApproval(shop._id, "Rejected")}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-sm btn-primary w-20"
                          onClick={() => {
                            setFPS(shop);
                            (
                              document.getElementById(
                                "fpsDetails"
                              ) as HTMLDialogElement
                            ).showModal();
                          }}
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center">
                    No FPS records found for your Tehsil.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {fps && <FPSDetails fps={fps} />}
    </div>
  );
};

export default FPSFetchData;
