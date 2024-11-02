import Stock from "@/models/Stock";

export function getInitialStock(familyMembersCount: number, input: Stock) {
  const stock = baseStock[cardType];
  for (const key in stock) {
    stock[key] *= familyMembersCount;
  }

  return {
    ...stock,
    month: new Date().toLocaleString("default", { month: "long" }),
  };
}

export async function updateStock(
  rationCard: any,
  totalMember: number,
  session: any
) {
  const stock = new Stock(getInitialStock(rationCard.cardType, totalMember));
  const savedStock = await stock.save({ session });

  return savedStock;
}
