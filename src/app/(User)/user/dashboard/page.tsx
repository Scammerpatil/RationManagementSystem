"use client";
import { useUser } from "@/context/UserContext";
import { RationCard } from "@/types/RationCard";
import { FC } from "react";
import { User } from "@/types/User";
const UserDashboard: FC = () => {
  const { user, userType } = useUser();

  if (userType !== "RationCard" || !user) {
    return <p>No Ration Card data available.</p>;
  }

  const rationCardUser = user as RationCard;
  console.log("Family Members:", rationCardUser.members);

  return (
    <div className="p-10 bg-white rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Ration Card Management Dashboard
      </h1>

      {/* Ration Card Overview */}
      <div className="p-5 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Ration Card Overview</h2>
        <p>
          <strong>Ration Card Number:</strong>{" "}
          {rationCardUser?.rationCardNumber || "N/A"}
        </p>
        <p>
          <strong>Card Type:</strong> {rationCardUser?.cardType || "N/A"}
        </p>
        <p>
          <strong>Head of Family:</strong>{" "}
          {rationCardUser?.head?.fullName || "N/A"}
        </p>
        <p>
          <strong>Income:</strong> {rationCardUser?.head?.income || "N/A"}
        </p>
        <p>
          <strong>Caste Category:</strong>{" "}
          {rationCardUser?.head?.caste || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {rationCardUser?.address?.street || "N/A"},{" "}
          {rationCardUser?.address?.district || "N/A"},{" "}
          {rationCardUser?.address?.state || "N/A"},{" "}
          {rationCardUser?.address?.pincode || "N/A"}
        </p>
      </div>

      {/* Family Members */}
      <div className="p-5 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Family Members</h2>
        <ul className="list-disc ml-5">
          {rationCardUser.members && rationCardUser.members.length > 0 ? (
            rationCardUser.members.map((member, index) => (
              <li key={index}>
                {member.fullName ? member.fullName : "Unnamed Member"} -{" "}
                {member.relationship || "Relationship Unspecified"}
              </li>
            ))
          ) : (
            <p>No Members Added</p>
          )}
        </ul>
      </div>

      {/* Stock Allocation */}
      <div className="p-5 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Stock Allocation</h2>
        {rationCardUser.stock ? (
          <ul>
            <li>
              <strong>Wheat:</strong> {rationCardUser.stock.wheat || "N/A"}
            </li>
            <li>
              <strong>Rice:</strong> {rationCardUser.stock.rice || "N/A"}
            </li>
            <li>
              <strong>Sugar:</strong> {rationCardUser.stock.sugar || "N/A"}
            </li>
            <li>
              <strong>Oil:</strong> {rationCardUser.stock.oil || "N/A"}
            </li>
          </ul>
        ) : (
          <p>No Stock Allocation Data</p>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="p-5 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        {rationCardUser.transactions &&
        rationCardUser.transactions.length > 0 ? (
          rationCardUser.transactions.map((transaction, index) => (
            <div key={index} className="mb-3">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(transaction.date).toLocaleDateString() || "N/A"}
              </p>
              <ul>
                <li>
                  <strong>Wheat:</strong> {transaction.stock.wheat || "N/A"}
                </li>
                <li>
                  <strong>Rice:</strong> {transaction.stock.rice || "N/A"}
                </li>
                <li>
                  <strong>Sugar:</strong> {transaction.stock.sugar || "N/A"}
                </li>
                <li>
                  <strong>Oil:</strong> {transaction.stock.oil || "N/A"}
                </li>
              </ul>
            </div>
          ))
        ) : (
          <p>No Recent Transactions</p>
        )}
      </div>

      {/* Actions */}
      <div className="p-5 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="space-y-2">
          <button className="btn btn-primary w-full">
            Apply for New Scheme
          </button>
          <button className="btn btn-secondary w-full">
            Update Family Details
          </button>
          <button className="btn btn-accent w-full">
            View Allocated Stock
          </button>
          <button className="btn btn-info w-full">
            View Transaction History
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
