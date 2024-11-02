"use client";
import { Inter } from "next/font/google";
import "@/app/global.css";
import { UserProvider, useUser } from "@/context/UserContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { setUser, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const getUserFromToken = async () => {
      try {
        const response = await axios.get("/api/auth/verifyUser");
        if (response.data?.user) {
          console.log(response);
          setUser(response.data.rationCard, "RationCard");
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

  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Ration Card Management System</title>
      </head>
      <body className={`${inter.className} bg-white`}>{children}</body>
    </html>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <MainContent>{children}</MainContent>
    </UserProvider>
  );
}
