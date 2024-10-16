import nodemailer from "nodemailer";
import ejs from "ejs";
import fs from "fs";
import { RationCard } from "@/types/RationCard";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function approvalEmail(
  email: string,
  rationCard: RationCard
): Promise<boolean> {
  const template = fs.readFileSync(
    "./src/helper/approvalEmailTemplate.ejs",
    "utf-8"
  );

  const userName = rationCard.head.fullName;
  const rationCardNumber = rationCard.rationCardNumber;
  const rationCardType = rationCard.cardType;

  const mailOptions = {
    from: "Belogical | No Reply <",
    to: email,
    subject: "Verify Email",
    html: ejs.render(template, { userName, rationCardNumber, rationCardType }),
  };
  try {
    await new Promise<void>((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log("Email sent:", info.response);
          resolve();
        }
      });
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
