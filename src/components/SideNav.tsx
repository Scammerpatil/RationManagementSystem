"use client";
import { SideNavItem } from "@/types/types";
import { AlignJustify, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const SideNav = ({
  user,
  sidebar,
  children,
}: {
  user: any;
  sidebar: SideNavItem[];
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout");
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div
            className="navbar justify-between w-full pl-10"
            style={{
              background: "rgba(85, 114, 150, 0.27)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(10.8px)",
              WebkitBackdropFilter: "blur(10.8px)",
              border: "1px solid rgba(85, 114, 150, 0.3)",
            }}
          >
            <div className="lg:flex items-center justify-end space-x-2 hidden">
              <span className="text-base font-semibold text-gray-900">
                Home
              </span>
              {pathSegments.map((segment, index) => (
                <React.Fragment key={index}>
                  <span className="text-sm text-gray-700">
                    <ChevronRight />
                  </span>
                  <Link href={`/${pathSegments.slice(0, index + 1).join("/")}`}>
                    <span className="text-base capitalize hover:text-primary transition text-gray-900">
                      {segment.replace(/-/g, " ")}
                    </span>
                  </Link>
                </React.Fragment>
              ))}
            </div>
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost text-gray-900"
              >
                <AlignJustify className="h-6 w-6" />
              </label>
            </div>

            <div className="flex-1 justify-between lg:hidden px-2">
              <h1 className="text-xl font-bold text-gray-900">
                Ration Management System
              </h1>
            </div>

            <div className="block">
              <ul className="menu menu-horizontal">
                <div className="flex items-center gap-4 bg-transparent">
                  <div
                    tabIndex={0}
                    role="button"
                    className="dropdown dropdown-left cursor-pointer bg-transparent"
                    data-theme="cupcake"
                  >
                    <img
                      src={
                        user?.profileImageUrl
                          ? user.profileImageUrl
                          : "https://avatar.iran.liara.run/public"
                      }
                      alt="Avatar"
                      className="h-12 w-12 rounded-full"
                    />
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-white text-black rounded-box z-[999] w-72 p-2 shadow"
                      data-theme="cupcake"
                    >
                      {/* User Initial */}
                      <div className="flex items-center justify-center mb-2">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full text-xl font-bold">
                          {user?.head?.fullName
                            ? user.head.fullName.split(" ")[0][0]
                            : user?.ownerName?.split(" ")[0][0]}
                        </div>
                      </div>

                      {/* User Name */}
                      <div className="flex items-center justify-center">
                        <span className="text-lg font-semibold text-gray-900">
                          {user?.head?.fullName || user?.ownerName}
                        </span>
                      </div>

                      {/* Horizontal Rule */}
                      <hr className="my-2 border-gray-300" />

                      {/* Dropdown Items */}
                      <div className="flex flex-col">
                        <button
                          onClick={() => router.push("/account")}
                          className="text-left px-4 py-2 text-base text-gray-900 hover:bg-gray-200 transition duration-200"
                        >
                          My Account
                        </button>
                        <button
                          onClick={() => router.push("/profile")}
                          className="text-left px-4 py-2 text-base text-gray-900 hover:bg-gray-200 transition duration-200"
                        >
                          Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="text-left px-4 py-2 text-base text-gray-900 hover:bg-gray-200 transition duration-200"
                        >
                          Logout
                        </button>
                      </div>
                    </ul>
                  </div>
                </div>
              </ul>
            </div>
          </div>
          <div className="px-10 py-7 min-h-screen text-black">{children}</div>
        </div>

        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            className="drawer-overlay"
            aria-label="close sidebar"
          ></label>
          <div
            className="menu text-base-content min-h-full w-80 p-4"
            style={{
              background: "rgba(85, 114, 150, 0.27)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(10.8px)",
              WebkitBackdropFilter: "blur(10.8px)",
              border: "1px solid rgba(85, 114, 150, 0.3)",
            }}
          >
            <Link
              href="/teachers/dashboard"
              className="flex h-16 w-full flex-row items-center justify-center space-x-3 border-b border-gray-300 md:justify-start md:px-6"
            >
              <span className="h-10 w-10 rounded-lg bg-transparent">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Seal_of_Maharashtra.svg/300px-Seal_of_Maharashtra.svg.png"
                  alt="logo"
                  className="h-7 w-7"
                />
              </span>
              <span className="text-xl font-bold text-gray-900">
                Ration Management System
              </span>
            </Link>
            <div className="flex flex-col space-y-2 mt-10 md:px-6">
              {sidebar.map((item, idx) => (
                <MenuItem key={idx} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  const baseClasses =
    "flex w-full flex-row items-center justify-between rounded-lg p-2 hover:bg-gray-200";
  const activeClasses = "bg-gray-300 text-gray-900";
  const inactiveClasses = "text-gray-900 hover:text-gray-900 hover:bg-gray-100";

  return (
    <div>
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`${baseClasses} ${
              pathname.includes(item.path) ? activeClasses : inactiveClasses
            }`}
          >
            <div className="flex flex-row items-center space-x-4 text-gray-900">
              {item.icon}
              <span className="text-lg font-medium">{item.title}</span>
            </div>

            <div
              className={`transition-transform ${
                subMenuOpen ? "rotate-180" : ""
              } flex`}
            >
              <ChevronDown width="24" height="24" />
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-4 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => (
                <Link
                  key={idx}
                  href={subItem.path}
                  className={`block rounded-lg p-2 text-base ${
                    subItem.path === pathname
                      ? "font-semibold text-gray-900"
                      : "text-gray-600"
                  } hover:bg-gray-200`}
                >
                  <span>{subItem.title}</span>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row items-center space-x-4 rounded-lg p-2 ${
            item.path === pathname ? activeClasses : inactiveClasses
          }`}
        >
          {item.icon}
          <span className="text-lg font-medium">{item.title}</span>
        </Link>
      )}
    </div>
  );
};
