import TableSkeleton from "@/components/TableSkeleton";
import { useUser } from "@/context/UserContext";
import { RationCard } from "@/types/RationCard";
import { Tehsil } from "@/types/Tehsil";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

let rationCardPromise: Promise<RationCard[]> | null = null;
let cachedRationCard: RationCard[] | null = null;

const fetchRationCard = async ({
  taluka,
}: {
  taluka: string;
}): Promise<RationCard[]> => {
  if (cachedRationCard) return cachedRationCard;
  if (!rationCardPromise) {
    rationCardPromise = axios
      .post("/api/rationcard/getRationCardByTehsil", { taluka })
      .then((res) => {
        cachedRationCard = res.data;
        return res.data;
      })
      .catch((error) => {
        console.error("Failed to fetch ration card", error);
        toast.error("Failed to fetch ration card data.");
        return [];
      });
  }
  return rationCardPromise;
};

const ApprovedRationCard = () => {
  const [rationCardList, setRationCardList] = useState<RationCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchRationCardList = async () => {
      setLoading(true);
      try {
        if (user && (user as Tehsil).taluka) {
          const data = await fetchRationCard({
            taluka: (user as Tehsil).taluka,
          });
          setRationCardList(data);
        } else {
          toast.error("No user data available to fetch ration cards.");
        }
      } catch (err) {
        console.error("Failed to load ration card data", err);
        toast.error("Error fetching ration card data.");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchRationCardList();
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
        loading: "Updating ration card status...",
        success: `Ration card ${status}`,
        error: (e) => e.response.data.message || "Failed to update status.",
      });
    } catch (error) {
      console.error("Failed to update ration card status", error);
    }
  };

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="container mx-auto">
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-base border border-cyan-700">
          <thead className="bg-base-200">
            <tr className="text-base">
              <th className="border border-cyan-700">SR. No</th>
              <th className="border border-cyan-700">Card No</th>
              <th className="border border-cyan-700">Card Holder Name</th>
              <th className="border border-cyan-700">Address</th>
              <th className="border border-cyan-700">Mobile No</th>
              <th className="border border-cyan-700">Aadhar No</th>
              <th className="border border-cyan-700">Aadhar Front</th>
              <th className="border border-cyan-700">Aadhar Back</th>
              <th className="border border-cyan-700">Income Certificate</th>
              <th className="border border-cyan-700">Status</th>
              <th className="border border-cyan-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {rationCardList.length > 0 &&
            rationCardList.some((card) => card.isAdminApproved) ? (
              rationCardList
                .filter((card) => card.isAdminApproved === true)
                .map((card, index) => (
                  <tr key={card._id} className="hover:bg-gray-50 text-sm">
                    <td className="border border-cyan-700">{index + 1}</td>
                    <td className="border border-cyan-700">
                      {card.rationCardNumber}
                    </td>
                    <td className="border border-cyan-700">
                      {card.head.fullName}
                    </td>
                    <td className="border border-cyan-700">
                      {`${card.address.street}, ${card.address.taluka}, ${card.address.district}`}
                    </td>
                    <td className="border border-cyan-700">
                      {card.head.mobileNumber}
                    </td>
                    <td className="border border-cyan-700">
                      {card.head.aadharNumber}
                    </td>
                    <td className="border border-cyan-700">
                      <a
                        href={card.head.aadhaarFrontCardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 cursor-pointer"
                      >
                        View
                      </a>
                    </td>
                    <td className="border border-cyan-700">
                      <a
                        href={card.head.aadhaarBackCardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 cursor-pointer"
                      >
                        View
                      </a>
                    </td>
                    <td className="border border-cyan-700">
                      <a
                        href={card.head.incomeProofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 cursor-pointer"
                      >
                        View
                      </a>
                    </td>
                    <td className="border border-cyan-700">
                      {card.status || "Pending"}
                    </td>
                    <td className="border border-cyan-700 space-x-2">
                      {!card.isAdminApproved && (
                        <button
                          className="btn btn-sm btn-error w-20 m-0"
                          onClick={() => handleApproval(card._id, "Rejected")}
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={11} className="text-center border border-cyan-700">
                  {rationCardList.length === 0
                    ? `No ration cards found for ${(user as Tehsil)?.taluka}.`
                    : `No approved ration cards available for ${
                        (user as Tehsil)?.taluka
                      }.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovedRationCard;
