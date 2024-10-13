import React, { useState } from "react";
import { GiftIcon, IdCard, Newspaper, ListIcon } from "lucide-react";
import Link from "next/link";

interface ButtonList {
  text: string;
  link: string;
}

interface ButtonProps {
  name: string;
  icon: JSX.Element;
  list?: ButtonList[];
}
const buttons: ButtonProps[] = [
  {
    name: "Apply Now",
    list: [
      {
        text: "Apply for New Ration",
        link: "/ration/new",
      },
      {
        text: "Apply for Changes in Ration",
        link: "/public-login",
      },
      {
        text: "Download E-Ration Card",
        link: "/ration/download",
      },
    ],
    icon: <IdCard className="text-3xl" />,
  },
  {
    name: "Allocation",
    list: [
      {
        text: "View Current Allocation",
        link: "/allocation/view",
      },
      {
        text: "Check Allocation History",
        link: "/allocation/history",
      },
    ],
    icon: <GiftIcon className="text-3xl" />,
  },
  {
    name: "Distribution",
    list: [
      {
        text: "Track Distribution Status",
        link: "/distribution/status",
      },
      {
        text: "View Distribution Points",
        link: "/distribution/points",
      },
    ],
    icon: <Newspaper className="text-3xl" />,
  },
  {
    name: "New Scheme",
    list: [
      {
        text: "View Ongoing Schemes",
        link: "/scheme/ongoing",
      },
      {
        text: "Apply for New Schemes",
        link: "/scheme/apply",
      },
    ],
    icon: <GiftIcon className="text-3xl" />,
  },
  {
    name: "FPS Registration",
    list: [
      {
        text: "Register as FPS",
        link: "/fps/register",
      },
      {
        text: "Manage FPS Details",
        link: "/fps/manage",
      },
    ],
    icon: <IdCard className="text-3xl" />,
  },
  {
    name: "Reports",
    list: [
      {
        text: "View Monthly Reports",
        link: "/reports/monthly",
      },
      {
        text: "Download Annual Reports",
        link: "/reports/annual",
      },
    ],
    icon: <ListIcon className="text-3xl" />,
  },
];

function SubHeader() {
  return (
    <div className="shadow flex flex-row gap-5 justify-between p-4">
      <div className="flex-1 flex items-center">
        <div className="bg-blue-100 p-4 rounded-lg shadow-md text-black">
          <h3 className="text-xl font-semibold mb-2">
            Welcome to the Ration System
          </h3>
          <p className="text-sm">
            Access important services and updates related to ration distribution
            and schemes. Explore our services using the buttons on the right to
            apply, check allocations, and stay informed about new schemes.
          </p>
        </div>
      </div>
      <div className="flex-3 flex flex-row gap-5 justify-end">
        {buttons.map((button) => (
          <RationButton key={button.name} button={button} />
        ))}
      </div>
    </div>
  );
}

// Component for each button
const RationButton: React.FC<{ button: ButtonProps }> = ({ button }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsOpen(false);
    }, 500);
    setTimeoutId(id);
  };

  return (
    <div
      className="relative p-2 flex flex-col items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-800 text-white hover:bg-blue-900 focus:outline-none">
        {button.icon}
      </button>
      <span className="text-black font-bold mt-2">{button.name}</span>
      {isOpen && button.list && (
        <div className="absolute right-0 mt-16 w-60 bg-gray-900 border-0 px-3 pb-3 text-medium text-white rounded-md shadow-lg">
          <ul className="py-1">
            {button.list.map((li, index) => (
              <li key={index} className="border-b">
                <Link href={li.link} className="block px-4 py-2 text-sm">
                  {li.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SubHeader;
