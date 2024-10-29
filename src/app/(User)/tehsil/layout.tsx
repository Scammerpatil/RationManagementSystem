"use client";
import { Inter } from "next/font/google";
import "@/app/global.css";
import ToastContainer from "@/components/ToastContainer";
import SideNav from "@/components/SideNav";
import { SIDENAV_ITEMS } from "./constants";
import { UserProvider, useUser } from "@/context/UserContext";
import { Tehsil } from "@/types/Tehsil";
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
        const response = await axios.get("/api/tehsil/verifyTehsil");
        if (response.data.tehsil) {
          setUser(response.data.tehsil as Tehsil, "Tehsil");
        } else {
          setUser(null, null);
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to verify token:", error);
        setUser(null, null);
        router.push("/");
      }
    };
    getUserFromToken();
  }, [router]);

  const userRole = (user as Tehsil)?.tehsilUserId || "guest";

  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Ration Card Management System</title>
      </head>
      <body className={`${inter.className} bg-white`}>
        <SideNav sidebar={SIDENAV_ITEMS ?? []} userRole={userRole}>
          <ToastContainer />
          {children}
        </SideNav>
      </body>
    </html>
  );
};

export default RootLayout;
