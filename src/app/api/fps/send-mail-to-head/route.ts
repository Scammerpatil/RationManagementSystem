import { NextRequest, NextResponse } from "next/server";
import stockEmail from "@/middlewares/stockEmail";
import RationCard from "@/models/RationCard";
import dbConfig from "@/middlewares/db.config";
import nodemailer from "nodemailer";

dbConfig();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export async function POST(req: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const { rationCardNumbers } = body;

    if (
      !rationCardNumbers ||
      !Array.isArray(rationCardNumbers) ||
      rationCardNumbers.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or empty rationCardNumbers array provided",
        },
        { status: 400 }
      );
    }

    // Fetch all ration cards matching the given numbers
    const rationCards = await RationCard.find({
      rationCardNumber: { $in: rationCardNumbers },
    }).populate("head");

    if (!rationCards || rationCards.length === 0) {
      return NextResponse.json(
        { success: false, message: "No matching ration cards found" },
        { status: 404 }
      );
    }

    // Track failed email sends
    const failedEmails: string[] = [];

    // Send emails to heads of families
    for (const card of rationCards) {
      if (card.head && card.head.email) {
        const emailSent = await stockEmail(
          card.head.email,
          card.head.fullName,
          card.rationCardNumber
        );

        if (!emailSent) {
          failedEmails.push(card.head.email);
        }
        console.log(card.head.email);
        
      } else {
        failedEmails.push(card.head?.email || "Unknown");
      }
    }

    // Handle response based on success or failure
    if (failedEmails.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to send emails to the following addresses: ${failedEmails.join(
            ", "
          )}`,
        },
        { status: 207 } // Multi-status code for partial success
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Emails sent successfully to all ration card holders",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in sending emails:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing the request",
      },
      { status: 500 }
    );
  }
}