import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const data = {
  labels: [
    "Total Beneficiaries",
    "Active Members",
    "New Applications",
    "Renewals Processed",
  ],
  datasets: [
    {
      data: [5432000, 4876000, 23456, 12345],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      hoverOffset: 4,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem: any) {
          return `${tooltipItem.label}: ${tooltipItem.raw.toLocaleString()}`;
        },
      },
    },
  },
};

function Hero() {
  return (
    <div className="p-4">
      <div className="flex gap-4">
        <Announcement />
        <StatisticsDashboard />
      </div>
    </div>
  );
}

const Announcement = () => {
  const announcements = [
    "The deadline for applying for a new ration card has been extended to September 30, 2024.",
    "Important: All existing ration cards need to be updated with current addresses by October 15, 2024.",
    "New scheme launched: 'Ration Benefits for Senior Citizens' - apply now to avail benefits.",
    "Reminder: Submit your annual income proof for ration card renewal before December 31, 2024.",
  ];

  return (
    <div className="w-1/2 p-4 bg-yellow-100 border border-yellow-300 rounded-lg shadow-lg relative">
      <h3
        className="text-xl font-bold mb-4 text-gray-800"
        style={{ fontFamily: "cursive" }}
      >
        Announcements
      </h3>
      <ul
        className="list-disc pl-5 space-y-2 text-gray-700"
        style={{ fontFamily: "cursive" }}
      >
        {announcements.map((announcement, index) => (
          <li key={index}>{announcement}</li>
        ))}
      </ul>
      <div className="mt-4 p-4 bg-yellow-200 border border-yellow-400 rounded-lg shadow-inner">
        <h4
          className="text-lg font-semibold mb-2"
          style={{ fontFamily: "cursive" }}
        >
          Important Forms
        </h4>
        <div className="flex flex-col space-y-2">
          <a
            href="/forms/new-ration-card"
            className="text-blue-600 hover:underline"
          >
            Download New Ration Card Application Form
          </a>
          <a
            href="/forms/update-address"
            className="text-blue-600 hover:underline"
          >
            Download Address Update Form
          </a>
          <a href="/forms/renewal" className="text-blue-600 hover:underline">
            Download Ration Card Renewal Form
          </a>
        </div>
      </div>
    </div>
  );
};
const StatisticsDashboard = () => {
  return (
    <div className="w-1/2 p-4 bg-gray-200 rounded-lg shadow-lg text-black">
      <h3 className="text-xl font-bold mb-4">Statistics Dashboard</h3>
      <div className="flex justify-center">
        <div className="w-96 h-96">
          <Pie data={data} options={options} />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span className="font-semibold">Total Ration Beneficiaries:</span>
          <span className="text-black">5,432,000</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Active Ration Card Members:</span>
          <span className="text-black">4,876,000</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">New Applications This Month:</span>
          <span className="text-black">23,456</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Renewals Processed:</span>
          <span className="text-black">12,345</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
