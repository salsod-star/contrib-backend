import nodemailer from "nodemailer";

type messageProps = {
  from: string; // sender address
  to: string; // list of receivers e.g "bar@example.com, baz@example.com"
  subject: string; // Subject line
  text: string; // plain text body
  // html: "<b>Hello world?</b>", // ht
};

// const transport = nodemailer.createTransport({
//     host:
// })

export const sendMail = (message: messageProps) => {};
