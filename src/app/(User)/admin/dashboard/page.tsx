"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tehsil } from "@/types/Tehsil";
import { FairPriceShop } from "@/types/FPS";
import { RationCard } from "@/types/RationCard";
import { User } from "@/types/User";

const AdminDashboard = () => {
  const [details, setDetails] = useState<{
    tehsils: Tehsil[];
    fps: FairPriceShop[];
    rationCards: RationCard[];
    users: User[];
  }>({
    rationCards: [],
    tehsils: [],
    fps: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get("/api/admin/stats");
        setDetails(statsRes.data);
        localStorage.setItem("stats", JSON.stringify(statsRes.data));
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-primary text-primary-content p-4">
          <h2 className="text-lg font-semibold">Total Tehsils</h2>
          <p className="text-3xl font-bold">{details.tehsils.length}</p>
        </div>
        <div className="card bg-secondary text-secondary-content p-4">
          <h2 className="text-lg font-semibold">Total FPS</h2>
          <p className="text-3xl font-bold">{details.fps.length}</p>
        </div>
        <div className="card bg-accent text-accent-content p-4">
          <h2 className="text-lg font-semibold">Total Ration Cards</h2>
          <p className="text-3xl font-bold">{details.rationCards.length}</p>
        </div>
        <div className="card bg-info text-info-content p-4">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-3xl font-bold">{details.users.length}</p>
        </div>
      </div>

      {/* Tehsils Table */}
      <div className="card bg-base-100 shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Tehsils</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>District</th>
              </tr>
            </thead>
            <tbody>
              {details.tehsils.map((tehsil: Tehsil, index) => (
                <tr key={tehsil.tehsilUserId}>
                  <td>{index + 1}</td>
                  <td>{tehsil.taluka}</td>
                  <td>{tehsil.pincode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FPS Table */}
      <div className="card bg-base-100 shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Fair Price Shops</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Pincode</th>
                <th>Tehsil</th>
              </tr>
            </thead>
            <tbody>
              {details.fps.map((fps: FairPriceShop, index) => (
                <tr key={fps.fpsUserId}>
                  <td>{index + 1}</td>
                  <td>{fps.fpsUserId}</td>
                  <td>{fps.fullName}</td>
                  <td>{fps.pincode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ration Cards Table */}
      <div className="card bg-base-100 shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Ration Cards</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Card Number</th>
                <th>Owner</th>
                <th>Members</th>
              </tr>
            </thead>
            <tbody>
              {details.rationCards.map((card: RationCard, index) => (
                <tr key={card._id}>
                  <td>{index + 1}</td>
                  <td>{card.rationCardNumber}</td>
                  <td>{card.head.fullName}</td>
                  <td>{card.members.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
