"use client";
import { Inter } from "next/font/google";
import "@/app/global.css";
import ToastContainer from "@/components/ToastContainer";
import { SIDENAV_ITEMS } from "./constants";
import SideNav from "./components/SideNav";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Ration Card Management System</title>
      </head>
      <body className={`${inter.className} bg-white`}>
        <SideNav sidebar={SIDENAV_ITEMS ?? []}>
          <ToastContainer />
          {children}
        </SideNav>
      </body>
    </html>
  );
};

export default RootLayout;
