import {
  MONGO_ATLAS_URL,
  MONGO_URL,
  PERSISTANCE,
  PORT,
} from "../config/config.js";
import mongoose from "mongoose";
import logger from "../utils/logger.js";
console.log(PERSISTANCE)

export const ServerUp = async (app) => {
  switch (PERSISTANCE) {
    case "DEV":
      try {
        await mongoose.connect(MONGO_URL, {
          dbName:"JaggerStore",
        });
        logger.debug("DB development connected!");
        app.listen(PORT, () =>
          logger.info(`Server Up on http://localhost:${PORT}/api/products\n`)
        );
      } catch (err) {
        logger.fatal("Error when trying to start the server.\n", err)
      }
      break;

    case "PROD":
      try {
        await mongoose.connect(MONGO_ATLAS_URL, {
          dbName:"JaggerStore",
        });
        logger.debug("DB production connected!");
        app.listen(PORT, () =>
          logger.info(`Server Up on http://localhost:${PORT}/api/products\n`)
        );
      } catch (err) {
        logger.fatal("Error when trying to start the server.\n", err)
      }
      break;
  }
};