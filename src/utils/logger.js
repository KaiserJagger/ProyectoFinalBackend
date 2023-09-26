import winston from "winston";
import  {PERSISTANCE}  from "../config/config.js";

const custom = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },

  colors: {
    debug: "blue",
    http: "green",
    info: "white",
    warning: "yellow",
    error: "red",
    fatal: "magenta",
  },
};

winston.addColors(custom.colors);

const createLogger = (env) => {
  if (env === "PROD") {
    return winston.createLogger({
      levels: custom.levels,
      transports: [
        new winston.transports.File({
          filename: "./logs/errors.log",
          level: "debug",
          format: winston.format.simple(),
        }),
        new winston.transports.Console({
          level: "info",
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
      ],
    });
  } else {
    return winston.createLogger({
      levels: custom.levels,
      transports: [
        new winston.transports.Console({
          level: "debug",
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
      ],
    });
  }
};

export default createLogger(PERSISTANCE);
