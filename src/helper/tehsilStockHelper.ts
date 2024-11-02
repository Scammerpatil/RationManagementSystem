import FairPriceShop from "@/models/FairPriceShop";
import Stock from "@/models/Stock";
import Tehsil from "@/models/Tehsil";
import { Stock as StockType } from "@/types/Stock";
import { ObjectId } from "mongoose";

export const updateTehsilStock = async (tehsilId: ObjectId) => {
  const tehsil = await Tehsil.findById(tehsilId)
    .populate("stock")
    .populate({
      path: "fpsShopUnder",
      populate: { path: "stock" },
    });

  if (!tehsil) {
    console.error("Tehsil not found");
    return;
  }

  const stock = await Stock.findById(tehsil.stock);
  if (!stock) {
    console.error("Stock not found");
    return;
  }

  const stockItems: (keyof StockType)[] = [
    "wheat",
    "rice",
    "bajra",
    "sugar",
    "corn",
    "oil",
  ];

  // Reset stock values to 0
  stockItems.forEach((item) => {
    stock[item] = 0;
  });

  // Accumulate stock from each FPS under the Tehsil
  for (const fps of tehsil.fpsShopUnder) {
    const fpsStock = fps.stock as StockType;
    console.log("FPS Stock:", fpsStock);
    if (fpsStock) {
      stockItems.forEach((item) => {
        stock[item] += fpsStock[item] || 0;
      });
    }
  }

  // Save the updated Tehsil stock
  await stock.save();
  console.log("Updated Tehsil stock:", stock);
};
