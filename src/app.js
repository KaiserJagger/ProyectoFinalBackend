import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import path from "path";
import passport from "passport";
import { fileURLToPath } from "url";
import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUiExpress from "swagger-ui-express";

import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import sessionRouter from "./routers/session.router.js";
import loggerTest from "./routers/loggerTest.router.js";
import usersRouter from "./routers/users.router.js";
import usersManager from "./routers/usersManager.js";
import initializePassport from "./config/passport.config.js";
import { MONGO_DB_NAME, MONGO_URL, SESSION_SECRET } from "./config/config.js";
import { generateProductsMocking } from "./utils/utils.js";
import { ServerUp } from "./dto/persistanceFactory.js";
import { generateProducts } from "./utils/utils.js";
import errorHandler from "./middleware/error.middleware.js";
import error404 from "./middleware/404.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable("x-powered-by");
app.use(errorHandler);

const publicDirectoryPath = path.join(__dirname, "public");
app.use(express.static(publicDirectoryPath));

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "JaggerStore- Documentation",
      description: "Administracion de API de ecommerce (productos y carritos)",
    },
  },
  apis: ["./docs/**/*.yaml"],
};

const specs = swaggerJSDoc(swaggerOptions);

const hbs = exphbs.create();
app.engine("handlebars", hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      dbName: MONGO_DB_NAME,
    }),
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/api/session/login");
};


app.use("/api/products", ensureAuthenticated, productsRouter);
app.use("/api/carts", ensureAuthenticated, cartsRouter);
app.use("/api/session", sessionRouter);
app.use("/api/loggerTest", loggerTest);
app.use("/api/user", ensureAuthenticated, usersRouter);
app.use("/api/users", ensureAuthenticated, usersManager);
app.use("/docs", SwaggerUiExpress.serve, SwaggerUiExpress.setup(specs));
app.use(error404);

// mocking products
generateProductsMocking();

// DB products
generateProducts();

ServerUp(app);
