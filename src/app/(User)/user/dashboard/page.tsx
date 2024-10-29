"use client";
import { useUser } from "@/context/UserContext";

const UserDashboard: React.FC = () => {
  const { user, setUser } = useUser();

  return (
    <div className="p-10 bg-white rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Ration Card Management Dashboard
      </h1>
      <p>{}</p>

      {/* Ration Card Overview */}
      <div className="p-5 rounded-lg shadow-lg mb-6 ">
        <h2 className="text-xl font-semibold mb-4">Ration Card Overview</h2>
        <p>
          <strong>Ration Card Number:</strong> {user!.rationCardNumber}
        </p>
        <p>
          <strong>Card Type:</strong> {rationCard.cardType}
        </p>
        <p>
          <strong>Head of Family:</strong> {rationCard.head.fullName}
        </p>
        <p>
          <strong>Income:</strong> {rationCard.head.income}
        </p>
        <p>
          <strong>Caste Category:</strong> {rationCard.head.casteCategory}
        </p>
        <p>
          <strong>Address:</strong> {rationCard.address.street},{" "}
          {rationCard.address.district}, {rationCard.address.state},{" "}
          {rationCard.address.pincode}
        </p>
      </div>

      {/* Family Members */}
      {/* <div className="p-5 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Family Members</h2>
        <ul className="list-disc ml-5">
          {user.familyMembers.map((member, index) => (
            <li key={index}>
              {member.name} - {member.role}
            </li>
          ))}
        </ul>
      </div> */}

      {/* Stock Allocation */}
      {/* <div className="p-5 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Stock Allocation</h2>
        <ul>
          <li>
            <strong>Wheat:</strong> {user.stockAllocation.wheat}
          </li>
          <li>
            <strong>Rice:</strong> {user.stockAllocation.rice}
          </li>
          <li>
            <strong>Sugar:</strong> {user.stockAllocation.sugar}
          </li>
          <li>
            <strong>Oil:</strong> {user.stockAllocation.oil}
          </li>
        </ul>
      </div> */}

      {/* Recent Transactions */}
      {/* <div className="p-5 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        {user.recentTransactions.map((transaction, index) => (
          <div key={index} className="mb-3">
            <p>
              <strong>Date:</strong> {transaction.date}
            </p>
            <ul>
              <li>
                <strong>Wheat:</strong> {transaction.wheat}
              </li>
              <li>
                <strong>Rice:</strong> {transaction.rice}
              </li>
              <li>
                <strong>Sugar:</strong> {transaction.sugar}
              </li>
              <li>
                <strong>Oil:</strong> {transaction.oil}
              </li>
            </ul>
          </div>
        ))}
      </div> */}

      {/* Notifications/Updates */}
      {/* <div className="p-5 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Notifications/Updates</h2>
        <ul className="list-disc ml-5">
          {user.notifications.map((notification, index) => (
            <li key={index}>{notification}</li>
          ))}
        </ul>
      </div> */}

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
