export interface Transaction {
  date: string;
  item: string;
  quantity: number;
  type: "Received" | "Distributed";
}
