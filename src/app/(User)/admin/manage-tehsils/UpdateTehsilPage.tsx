"use client";

import { Tehsil } from "@/types/Tehsil";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateTehsilPage = ({ tehsil }: { tehsil: Tehsil[] }) => {
  const [selectedTehsil, setSelectedTehsil] = useState<Tehsil | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  const handleEditClick = (tehsil: Tehsil) => {
    setSelectedTehsil(tehsil);
    setFormVisible(true);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = axios.put(`/api/tehsil/updateTehsil`, {
        tehsil: selectedTehsil,
      });
      toast.promise(response, {
        loading: "Updating Tehsil...",
        success: "Tehsil updated successfully!",
        error: "Failed to update tehsil.",
      });
      setFormVisible(false);
    } catch (error) {
      console.error("Error updating tehsil:", error);
      toast.error("Failed to update tehsil.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSelectedTehsil({
      ...selectedTehsil!,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Tehsils</h1>

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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tehsil?.map((tehsil, index) => (
                <tr key={tehsil.tehsilUserId}>
                  <td>{index + 1}</td>
                  <td className="capitalize">{tehsil.taluka}</td>
                  <td>{tehsil.address.district}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEditClick(tehsil)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Form */}
      {formVisible && selectedTehsil && (
        <div className="card bg-base-100 shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Edit Tehsil</h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Taluka</span>
              </label>
              <input
                type="text"
                name="taluka"
                value={selectedTehsil.taluka}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">District</span>
              </label>
              <input
                type="text"
                name="district"
                value={selectedTehsil.address.district}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Pincode</span>
              </label>
              <input
                type="text"
                name="pincode"
                value={selectedTehsil.pincode}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
            </div>
            <button type="submit" className="btn btn-success">
              Update Tehsil
            </button>
            <button
              type="button"
              className="btn btn-secondary ml-4"
              onClick={() => setFormVisible(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateTehsilPage;
