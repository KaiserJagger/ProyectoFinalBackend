import nodemailer from "nodemailer";
import mailgen from "mailgen";
import logger from "./logger.js";
import { GMAIL_CONFIG } from "../config/config.js";

export const deleteAccountMailer = async (email) => {
  const mailerConfig = {
    service: "gmail",
    auth: { user: GMAIL_CONFIG.user, pass: GMAIL_CONFIG.pass },
  };

  let transporter = nodemailer.createTransport(mailerConfig);

  const Mailgenerator = new mailgen({
    theme: "default",
    product: {
      name: "JaggerStore",
      link: "https://jaggerstore-production-c4a6.up.railway.app/api/products",
    },
  });

  const response = {
    body: {
      name: email,
      intro: "Your account has been deleted",
      action: {
        instructions:
          "Your account was deleted due to inactivity. To create a new account, click on the button",
        button: {
          color: "#22BC66",
          text: "Create new account",
          link: "https://jaggerstore-production-c4a6.up.railway.app/api/session/register",
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  const mail = Mailgenerator.generate(response);

  let message = {
    from: GMAIL_CONFIG.user,
    to: email,
    subject: "JaggerStore- Your account has been deleted",
    html: mail,
  };

  try {
    await transporter.sendMail(message);

    logger.info("(Delete Account) Emails sent successfully");
  } catch (err) {
    logger.error(`(Delete Account) Error when sending email. 
    ${err.stack}`);
  }
};

export const deleteProductMailer = async (productOwner, productTitle) => {
  const mailerConfig = {
    service: "gmail",
    auth: { user: GMAIL_CONFIG.user, pass: GMAIL_CONFIG.pass },
  };

  let transporter = nodemailer.createTransport(mailerConfig);

  const Mailgenerator = new mailgen({
    theme: "default",
    product: {
      name: "e-commerce API",
      link: "https://jaggerstore-production-c4a6.up.railway.app/api/session/login",
    },
  });

  const response = {
    body: {
      name: productOwner,
      intro: "Your product has been deleted",
      action: {
        instructions: `Your product "${productTitle}" has been removed from the store`,
        button: {
          color: "#176B87",
          text: "Go to store",
          link: "https://jaggerstore-production-c4a6.up.railway.app/api/products",
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  const mail = Mailgenerator.generate(response);

  let message = {
    from: GMAIL_CONFIG.user,
    to: productOwner,
    subject: "JaggerStore - Your product has been deleted",
    html: mail,
  };

  try {
    await transporter.sendMail(message);

    logger.info("(Delete Product) Emails sent successfully");
  } catch (err) {
    logger.error(`(Delete Product) Error when sending email. 
    ${err.stack}`);
  }
};