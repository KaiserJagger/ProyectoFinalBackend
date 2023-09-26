import { Router } from "express";
import logger from "../utils/logger.js";

const router = Router();

router.get("/", async (req, res) => {
    logger.debug("Level:5");
    logger.http("Level: 4");
    logger.info("Level: 3");
    logger.warning("Level: 2");
    logger.error("Level: 1");
    logger.fatal("Level: 0");
    res.send("<h1>Logger Test</h1>");
})

export default router;