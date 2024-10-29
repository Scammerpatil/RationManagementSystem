"use client";
import { Inter } from "next/font/google";
import "@/app/global.css";
import ToastContainer from "@/components/ToastContainer";
import SideNav from "@/components/SideNav";
import { SIDENAV_ITEMS } from "./constants";
import { UserProvider, useUser } from "@/context/UserContext";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <UserProvider>
      <MainContent>{children}</MainContent>
    </UserProvider>
  );
};

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { setUser, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const getUserFromToken = async () => {
      try {
        const response = await axios.get("/api/auth/verifyUser");
        if (response.data.user) {
          setUser(response.data.rationCard);
        } else {
          setUser(null);
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to verify token:", error);
        router.push("/");
      }
    };

    getUserFromToken();
  }, [router]);

  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Ration Card Management System</title>
      </head>
      <body className={`${inter.className} bg-white`}>
        <SideNav sidebar={SIDENAV_ITEMS ?? []} userRole={user!.head.role}>
          <ToastContainer />
          {children}
        </SideNav>
      </body>
    </html>
  );
};

export default RootLayout;
