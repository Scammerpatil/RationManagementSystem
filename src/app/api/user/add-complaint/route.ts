import { NextResponse } from "next/server";
import Complaint from "@/models/Complaint"; // Your Complaint model
import RationCard from "@/models/RationCard"; // Your RationCard model
import Tehsil from "@/models/Tehsil"; // Your Tehsil model

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { rationCardNumber, complaintType, description } = await request.json();

    // Validate the request data
    if (!rationCardNumber || !complaintType) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the ration card exists
    const rationCard = await RationCard.find({rationCardNumber});
    if (!rationCard) {
      return NextResponse.json(
        { message: "Ration Card not found" },
        { status: 404 }
      );
    }
    console.log(rationCard);
    

    // Get the Tehsil associated with the RationCard
    const tehsil = await Tehsil.findOne({
      district: rationCard.address.district,
    });
    if (!tehsil) {
      return NextResponse.json(
        { message: "Tehsil not found" },
        { status: 404 }
      );
    }

    // Create the new complaint document
    const complaint = new Complaint({
      rationCardNumber,
      complaintType,
      description: complaintType === "Others" ? description : complaintType, // Use 'Others' description if provided
      tehsilId: tehsil._id, // Linking the complaint to the found Tehsil
    });

    // Save the complaint to the database
    await complaint.save();

    // Return success response
    return NextResponse.json(
      { message: "Complaint submitted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling complaint:", error);
    return NextResponse.json(
      { message: "Failed to submit complaint. Please try again later." },
      { status: 500 }
    );
  }
}
