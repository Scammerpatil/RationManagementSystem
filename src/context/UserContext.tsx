"use client";
import { FairPriceShop } from "@/types/FPS";
import { RationCard } from "@/types/RationCard";
import { Tehsil } from "@/types/Tehsil";
import { createContext, useState, useContext, ReactNode, Context } from "react";

type UserType = "RationCard" | "FairPriceShop" | "Tehsil" | null;

interface UserContextProps {
  user: RationCard | FairPriceShop | Tehsil | null;
  userType: UserType;
  setUser: (
    user: RationCard | FairPriceShop | Tehsil | null,
    type: UserType
  ) => void;
}

const UserContext: Context<UserContextProps | undefined> = createContext<
  UserContextProps | undefined
>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<RationCard | FairPriceShop | Tehsil | null>(
    null
  );
  const [userType, setUserType] = useState<UserType>(null);

  const handleSetUser = (
    newUser: RationCard | FairPriceShop | Tehsil | null,
    type: UserType
  ) => {
    setUser(newUser);
    setUserType(type);
  };

  return (
    <UserContext.Provider value={{ user, userType, setUser: handleSetUser }}>
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
