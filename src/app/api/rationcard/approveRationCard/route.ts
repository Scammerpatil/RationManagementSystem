import { updateFPSStock } from "@/helper/fpsHelpers";
import approvalEmail from "@/middlewares/approvalEmail";
import dbConfig from "@/middlewares/db.config";
import FairPriceShop from "@/models/FairPriceShop";
import RationCard from "@/models/RationCard";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function PUT(req: NextRequest) {
  const { rationCardId, status } = await req.json();
  const acceptedStatus = status === "Approved";

  try {
    const rationCard = await RationCard.findById(rationCardId)
      .populate("head")
      .populate("address");
    if (!rationCard) {
      return NextResponse.json(
        { message: "Ration Card not found" },
        { status: 404 }
      );
    }

    if (rationCard.status === "Cancelled") {
      return NextResponse.json(
        { message: "Ration Card is cancelled" },
        { status: 400 }
      );
    }

    if (rationCard.isAdminApproved) {
      return NextResponse.json(
        { message: "Ration Card is already approved" },
        { status: 400 }
      );
    }

    if (acceptedStatus) {
      rationCard.isAdminApproved = true;

      const fps = await FairPriceShop.findOne({
        pincode: rationCard.address.pincode,
      });
      if (!fps) {
        return NextResponse.json(
          { message: "Fair Price Shop not found" },
          { status: 404 }
        );
      }

      // Add ration card to FPS and update stock
      fps.rationUnder.push(rationCard._id);

      await fps.save();
      await updateFPSStock(fps._id);
      await approvalEmail(rationCard.head.email, rationCard);
      await rationCard.save();
      return NextResponse.json(
        { message: "Ration Card Approved" },
        { status: 200 }
      );
    } else {
      // Reject Ration Card
      rationCard.status = "Rejected";
      await rationCard.save();
      return NextResponse.json(
        { message: "Ration Card Rejected" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error processing Ration Card approval:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
