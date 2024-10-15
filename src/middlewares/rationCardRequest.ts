import nodemailer from "nodemailer";
import ejs from "ejs";
import fs from "fs";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function rationCardRequest(
  email: string,
  rationCard: any
): Promise<boolean> {
  const template = fs.readFileSync(
    "./src/helper/rationRequestTemplate.ejs",
    "utf-8"
  );
  const mailOptions = {
    from: "Belogical | No Reply <",
    to: email,
    subject: "Request for new Ration Card",
    html: ejs.render(template, {
      userName: rationCard.head?.fullName,
      rationCardType: rationCard.cardType,
      applicationNumber: rationCard.rationNumber,
    }),
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
