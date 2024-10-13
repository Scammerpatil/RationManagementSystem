"use client";
import { Inter } from "next/font/google";
import "@/app/global.css";
import ToastContainer from "@/components/ToastContainer";
import SideNav from "@/components/SideNav";
import useUser from "@/hooks/useUser";
import { SIDENAV_ITEMS } from "./constants";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useUser();
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Ration Card Management System</title>
      </head>
      <body className={`${inter.className} bg-white`}>
        <SideNav user={user} sidebar={SIDENAV_ITEMS ?? []}>
          <ToastContainer />
          {children}
        </SideNav>
      </body>
    </html>
  );
}
