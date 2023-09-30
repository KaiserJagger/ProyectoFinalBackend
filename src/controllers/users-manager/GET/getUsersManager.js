import UserModel from "../../../dao/models/user.model.js";
import logger from "../../../utils/logger.js";

export const getUsers = async (req, res) => {
  const user = req.user;
  const users = await UserModel.find().lean();

  logger.http(`/api/users (admin dashboard) ${user.email}`);
  res.status(200).render("users-manager", { users });
};