import Address from "@/models/Address";
import FairPriceShop from "@/models/FairPriceShop";
import RationCard from "@/models/RationCard";
import Stock from "@/models/Stock";
import Tehsil from "@/models/Tehsil";
import User from "@/models/User";
import mongoose from "mongoose";

// Database Connection

const dbConfig = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Connected to the Database");
    });
    connection.on("error", (error) => {
      console.log("Error: ", error);
    });
  } catch (error) {
    console.log("Error: ", error);
  }
  User;
  Stock;
  RationCard;
  Address;
  Tehsil;
  FairPriceShop;
};

export default dbConfig;
