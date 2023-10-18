// import UserModel from "../../../dao/models/user.model.js";
// import e from "express";
import logger from "../../../utils/logger.js";
import { getUserById } from "../../../services/usersManager.service.js";

export const updateUserRole = async (req, res) => {
  const userId = req.params.userId;
  const email = req.user.email;

  try {
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (email === user.email) {
      return res
        .status(403)
        .send("You are not authorized to perform this action");
    }

    res.render("update-user-role-dashboard", user);
  } catch (err) {
    logger.error(`
      Error while rendering update user role dashboard.
      ${err.stack}
    `)
    res.status(500).send("Internal Server Error");
  }
};