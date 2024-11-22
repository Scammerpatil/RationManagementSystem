import nodemailer from "nodemailer";
import ejs from "ejs";
import fs from "fs";
import path from "path";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function POST(
email: string, token: string, subject: string): Promise<boolean> {
  const template = fs.readFileSync("./src/helper/mailTemplate.ejs", "utf-8");
  const mailOptions = {
    from: "Belogical | No Reply <",
    to: email,
    subject: "Verify Email",
    html: ejs.render(template, { token }),
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
