"use client";
import { Tehsil } from "@/types/Tehsil";
import { useEffect, useState } from "react";
import AddTehsilForm from "./AddTehsilForm";
import axios from "axios";
import UpdateTehsilPage from "./UpdateTehsilPage";

const ManageTehsil = () => {
  const [tehsil, setTehsil] = useState<Tehsil[] | undefined>(undefined);
  useEffect(() => {
    const response = axios.get("/api/tehsil");
    response.then((res) => {
      setTehsil(res.data);
    });
  }, []);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Manage Tehsils</h1>
      <div
        role="tablist"
        className="tabs tabs-lifted bg-base-300 p-10 border-r-4 overflow-x-scroll"
      >
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab text-xl"
          aria-label="Add Tehsil"
          defaultChecked
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          <AddTehsilForm />
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab text-xl p-2"
          aria-label="Update Tehsil"
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          <UpdateTehsilPage tehsil={tehsil || undefined} />
        </div>
      </div>
    </div>
  );
};

export default ManageTehsil;
