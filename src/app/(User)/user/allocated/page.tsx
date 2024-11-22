"use client";

import { useUser } from "@/context/UserContext";
import { Transaction } from "@/types/Transaction";
import { useEffect, useState } from "react";

const Allocated = () => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  if (!user) return null;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`/api/transactions?userId=${user._id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    if (user?._id) {
      fetchTransactions();
    }
  }, [user]);

  // Function to render stock items one by one
  const renderStockItems = (stock: any) => {
    // Define the stock items in the schema
    const stockItems = [
      { name: "Wheat", value: stock.wheat },
      { name: "Rice", value: stock.rice },
      { name: "Bajra", value: stock.bajra },
      { name: "Sugar", value: stock.sugar },
      { name: "Corn", value: stock.corn },
      { name: "Oil", value: stock.oil },
    ];

    return stockItems.map((item, index) => (
      <p key={index}>
        <strong>{item.name}:</strong> {item.value}
      </p>
    ));
  };

  return (
    <div>
      <h1>Stock History</h1>
      {transactions.length > 0 ? (
        <div>
          <h3>Transaction Records</h3>
          {transactions.map((transaction, index) => (
            <div key={index} className="mb-4 border-b pb-2">
              <h4>Date: {new Date(transaction.date).toLocaleDateString()}</h4>

              {/* Rendering sender details */}
              <p>
                <strong>Sender:</strong> {transaction.senderType} (
                {transaction.senderId ? transaction.senderId._id : "N/A"})
                {transaction.senderId && transaction.senderId.name && (
                  <span> - {transaction.senderId.name}</span>
                )}
                {transaction.senderId && transaction.senderId.pincode && (
                  <span>, Pincode: {transaction.senderId.pincode}</span>
                )}
              </p>

              {/* Rendering receiver details */}
              <p>
                <strong>Receiver:</strong> {transaction.receiverType} (
                {transaction.receiverId ? transaction.receiverId._id : "N/A"})
                {transaction.receiverId && transaction.receiverId.name && (
                  <span> - {transaction.receiverId.name}</span>
                )}
                {transaction.receiverId && transaction.receiverId.pincode && (
                  <span>, Pincode: {transaction.receiverId.pincode}</span>
                )}
              </p>

              {/* Rendering stock items one by one */}
              <div>
                <h5>Stock Items</h5>
                {transaction.stock && renderStockItems(transaction.stock)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No Transactions Found</p>
      )}
    </div>
  );
};

export default Allocated;
