"use client";
import { FairPriceShop } from "@/types/FPS";
import { RationCard } from "@/types/RationCard";
import { createContext, useState, useContext, ReactNode, Context } from "react";

interface UserContextProps {
  user: RationCard | FairPriceShop;
  setUser: (user: RationCard | FairPriceShop) => void;
}

const UserContext: Context<UserContextProps | undefined> = createContext<
  UserContextProps | undefined
>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<RationCard | FairPriceShop>();
  const handleSetUser = (newUser: RationCard | FairPriceShop) => {
    console.log("Setting user:", newUser);
    setUser(newUser);
  };

  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
