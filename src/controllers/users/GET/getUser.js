import { getUserService } from "../../../services/users.service.js";
import logger from "../../../utils/logger.js";

export const getUser = async (req, res) => {
  const user = req.user;
  const userData = await getUserService(user);

  logger.http("GET /api/users");
  res.render("users", userData);
};
