import { Router } from "express";
import passport from "passport";
import mailgen from "mailgen";
import nodemailer from "nodemailer";
import logger from "../utils/logger.js";
import UserModel from "../dao/models/user.model.js";
import { createHash, generateRandomString } from "../utils/utils.js";
import UserPasswordModel from "../dao/models/userPassword.model.js";
import { GMAIL_CONFIG, PORT } from "../config/config.js";

const router = Router();

router.get("/register", async (req, res) => {
  logger.http("GET /session/register");

  res.render("sessions/register");
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/session/failureRegister",
  }),
  async (req, res) => {
    logger.info("POST /session/register success");
    res.redirect("/api/session/login");
  }
);

router.get("/failureRegister", (req, res) => {
  res.send({ error: "failed!" });
});

router.get("/login", async (req, res) => {
  res.render("sessions/login");
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/api/session/failLogin" }),
  async (req, res) => {
    if (!req.user) {
      const errorMessage = "Credenciales inválidas. Verifique su correo y contraseña.";
      return res.render("sessions/login", { message: errorMessage });
    }
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
    };

    req.user.last_login = new Date();
    await req.user.save();
    
    logger.info("Login success");

    res.redirect("/api/products");
  }
);

router.get("/failLogin", async (req, res) => {
  res.send({ error: "Fail in login" });
});

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error("Error in logout\n", err);
      res.status(500).render("errors/base", { error: err });
    } else {
      logger.info("Logout success");
      res.redirect("/api/session/login");
    }
  });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/api/session/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/api/products");
  }
);

router.get("/forgot-password", async (req, res) => {
  res.render("sessions/forgotPassword");
});

router.post("/forgot-password", async (req, res) => {
  const email = req.body.email;
  const user = await UserModel.findOne({ email });
  if (!user) {
    logger.error("User not found - /forgot-password");
    return res.status(404).render("errors/404");
  }
  const token = generateRandomString(16);
  await UserPasswordModel.create({ email, token });

  const mailerConfig = {
    service: "gmail",
    auth: { user: GMAIL_CONFIG.user, pass: GMAIL_CONFIG.pass },
  };

  let transporter = nodemailer.createTransport(mailerConfig);

  const Mailgenerator = new mailgen({
    theme: "default",
    product: {
      name: "e-commerce API",
      link: "http://localhost:8080/api/products",
    },
  });

  const response = {
    body: {
      name: email,
      intro: "Welcome to password recovery",
      action: {
        instructions:
          "To reset your password, please click on the following button:",
        button: {
          color: "#036992",
          text: "Change your password",
          link: `http://localhost:${PORT}/api/session/verify-token/${token}`,
        },
      },
      outro: "If it wasn't you, ignore this email.",
    },
  };
  const mail = Mailgenerator.generate(response);

  let message = {
    from: GMAIL_CONFIG.user,
    to: email,
    subject: "[e-commerce API] Reset your password",
    html: mail,
  };
  try {
    transporter.sendMail(message);
    res.render("sessions/send-token", { email });
  } catch (err) {
    logger.error("Error in send token\n", err);
    res.render("errors/404");
  }
});

router.get("/reset-password/:token", async (req, res) => {
  res.redirect(`api/session/verify-token/${req.params.token}`);
});

router.get("/verify-token/:token", async (req, res) => {
  const userPassword = await UserPasswordModel.findOne({
    token: req.params.token,
  });
  if (!userPassword) {
    return (
      logger.error("Token verification error - /verify-token"),
      res.render("sessions/token-error")
    );
  }
  const user = userPassword.email;
  res.render("sessions/resetPassword", { user });
});

router.post("/reset-password/:user", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.params.user });
    await UserModel.findByIdAndUpdate(user, {
      password: createHash(req.body.password),
    });
    logger.info("Password reset success");
    res.render("sessions/reset-success");
    await UserPasswordModel.deleteOne({ email: req.params.user }); // cambiar por isUsed
  } catch (err) {
    logger.error("Error in reset password\n", err);
    res.render("errors/404");
  }
});

export default router;