"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/app/assets/logo.png";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import axios from "axios";
import toast from "react-hot-toast";

const Header = ({ user, router }) => {
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
  return (
    <header className="relative flex justify-between items-center p-4 bg-blue-500 text-white shadow-md">
      <div className="flex items-center">
        <Image
          src={logo}
          height={100}
          width={100}
          alt="Government Logo"
          className="w-12 h-12 mr-2"
        />
        <div>
          <p className="text-lg font-semibold">Government of Maharashtra</p>
          <p className="text-sm">
            Food, Civil Supplies & Consumer Protection Department
          </p>
        </div>
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
                src={"https://avatar.iran.liara.run/public"}
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
                    {user && user.head.fullName?.split(" ")[0][0]}
                  </div>
                </div>

                {/* User Name */}
                <div className="flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-900">
                    {user && user.name}
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
    </header>
  );
};

const NotApproved = () => {
  const router = useRouter();
  const user = useUser();

  console.log(user);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const renderPendingMessage = () => {
    if (!user) return null;

    switch (user.head.role || user.role) {
      case "user":
        return (
          <p>
            Your request for a new ration card is pending approval. You will be
            notified once it's approved.
          </p>
        );
      case "fps":
        return (
          <p>
            Your application to register as a Fair Price Shop is pending
            approval. Please wait for further updates.
          </p>
        );
      case "tehsil":
        return (
          <p>
            Your request to become a Tehsil officer is pending approval. Kindly
            check back later.
          </p>
        );
      default:
        return (
          <p>
            There is a pending request associated with your account. Please
            contact support for more information.
          </p>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header Section */}
      <Header user={user} router={router} />

      {/* Main Content Section */}
      <main className="flex-1 flex items-center justify-center text-center p-4">
        <div>
          <h2 className="text-2xl font-semibold">
            Your Account is Not Approved
          </h2>
          <div className="mt-4 text-lg text-gray-600">
            {renderPendingMessage()}
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  );
};

export default NotApproved;
