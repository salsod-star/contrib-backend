import nodemailer from "nodemailer";
import pug from "pug";
import { User } from "../db/models/user";
import htmlToText from "html-to-text";

export class Email {
  to: string;
  firstName: string;
  url: string;
  from: string;

  constructor(user: User, url: string) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = "SoftDev";
  }

  createTransport() {
    if (process.env.NODE_ENV === "production") {
      // SendGrid or MailGun transport

      return nodemailer.createTransport({
        service: "Mailgun",
        auth: {
          user: process.env.MAILGUN_USERNAME,
          pass: process.env.MAILGUN_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template: string, subject: string) {
    // 1. Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2. email options

    const emailOptions = {
      from: this.from, // sender address
      to: this.to, // list of receivers e.g "bar@example.com, baz@example.com"
      subject, // Subject line
      html, // html
      text: htmlToText.convert(html), // plain text body
    };

    // 3. Create transport

    await this.createTransport().sendMail(emailOptions);
  }

  async sendWelcome() {
    this.send("welcome", "Welcome to Contrib.");
  }

  async sendPasswordReset() {
    this.send(
      "passwordReset",
      "Your password reset link is ready and expires in 10 minutes"
    );
  }
}
