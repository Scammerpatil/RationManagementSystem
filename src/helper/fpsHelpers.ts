import FairPriceShop from "@/models/FairPriceShop";
import Stock from "@/models/Stock";
import { RationCard } from "@/types/RationCard";
import { Stock as StockType } from "@/types/Stock";

export async function updateFPSStock(fpsId: string) {
  const fps = await FairPriceShop.findById(fpsId)
    .populate({
      path: "rationUnder",
      populate: {
        path: "stock",
      },
    })
    .populate("stock");
  const stock = await Stock.findById(fps.stock);

  const stockItems: (keyof StockType)[] = [
    "wheat",
    "rice",
    "bajra",
    "sugar",
    "corn",
    "oil",
  ];
  stockItems.forEach((item) => {
    stock[item] = 0;
  });

  fps.rationUnder.forEach((rationCard: RationCard) => {
    const rationCardStock = rationCard.stock as StockType;
    stockItems.forEach((item) => {
      stock[item] += rationCardStock[item] || 0;
    });
  });

  await stock.save();
}
