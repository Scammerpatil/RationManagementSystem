"use client";
import { useUser } from "@/context/UserContext";
import { RationCard } from "@/types/RationCard";
import { Stock } from "@/types/Stock";

const Allocated = () => {
  const { user } = useUser() as unknown as RationCard;
  if (!user) return null;
  return (
    <div>
      <h1>Allocated</h1>
      {user.monthlyStockRecords.length > 0 ? (
        <div>
          <h3>Monthly Stock Records</h3>
          {user.monthlyStockRecords.map((record: Stock, index: number) => (
            <div key={index}>
              <h4>{record.month}</h4>
              <p>Bajra: {record.bajra}</p>
              <p>Corn: {record.corn}</p>
              <p>Oil: {record.oil}</p>
            </div>
          ))}
        </div>
      ) : (
        <p> No Allocation </p>
      )}
    </div>
  );
};
export default Allocated;
