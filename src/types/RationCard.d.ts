export type RationCard = {
  _id: ObjectId;
  rationCardNumber: string;
  cardType: "White" | "Saffron" | "Yellow";
  status: "Active" | "Suspended" | "Canceled";
  head: ObjectId;
  members?: ObjectId[];
  address: ObjectId;
  fpsId?: ObjectId;
  stock: ObjectId;
  isAdminApproved: boolean;
};
