"use client";
import { Suspense } from "react";
import TableSkeleton from "@/components/TableSkeleton";
import FPSFetchData from "./FPSDetails";

const VerifyFPSPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Verify FPS (Fair Price Shops)
      </h1>
      <Suspense fallback={<TableSkeleton />}>
        <FPSFetchData />
      </Suspense>
    </div>
  );
};

export default VerifyFPSPage;
