import nodemailer from "nodemailer";
import ejs from "ejs";
import fs from "fs";
import path from "path";

// Configure nodemailer transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function stockEmail(
  email: string,
  fullName: string,
  rationCardNumber: string
): Promise<boolean> {
  try {
    // Load the EJS template for the email content
    const templatePath = path.resolve("./src/helper/stockAvailable.ejs");
    const template = fs.readFileSync(templatePath, "utf-8");

    // Replace placeholders in the email template with actual data
    const mailContent = ejs.render(template, {
      fullName,
      rationCardNumber,
    });

    // Email options
    const mailOptions = {
      from: "Belogical | No Reply <your-email@example.com>", // Update with the correct sender email
      to: email,
      subject: "Stock Availability Notification",
      html: mailContent,
    };

    // Send email using transporter
    await new Promise<void>((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Failed to send email:", err);
          reject(err);
        } else {
          console.log("Email sent:", info.response);
          resolve();
        }
      });
    });

    return true; // Return true if the email was sent successfully
  } catch (error) {
    console.error("Error sending stock availability email:", error);
    return false; // Return false if there was an error
  }
}
