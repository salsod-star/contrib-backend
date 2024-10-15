import nodemailer from "nodemailer";

export type messageProps = {
  from: string; // sender address
  to: string; // list of receivers e.g "bar@example.com, baz@example.com"
  subject: string; // Subject line
  text: string; // plain text body
  html?: string; // html
};

console.log(process.env.EMAIL_HOST);

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendMail = async (message: messageProps) => {
  await transport.sendMail(message);
};
