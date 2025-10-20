import nodemailer from "nodemailer";
import { PROFILE_UPDATE_EMAIL_TEMPLATE } from "./templates.js";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});
// type UpdateEmailData = {
//   email: string;
//   intro: string;
// };

export const sendUpdateEmail = async ({ email, intro }) => {
  const htmlTemplate = PROFILE_UPDATE_EMAIL_TEMPLATE.replace(
    "{{intro}}",
    intro
  );

  const mailOptions = {
    from: `"True Market" <humblefoolz1729@gmail.com>`,
    to: email,
    subject: `Welcome to True Market - your real prediction market`,
    text: "Thanks for updating email",
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};
