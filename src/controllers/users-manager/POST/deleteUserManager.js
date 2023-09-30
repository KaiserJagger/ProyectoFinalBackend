import UserModel from "../../../dao/models/user.model.js";
import logger from "../../../utils/logger.js";
import { deleteUserByIdService } from "../../../services/usersManager.service.js";
import { ADMIN_EMAIL } from "../../../config/config.js";

export const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userToDelete = await UserModel.findOne({ _id: userId });

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToDelete.email === ADMIN_EMAIL) {
      return res.status(403).render("errors/deleteAdminError");
    }

    if (userId === req.user.id) {
      return res
        .status(403)
        .json({ message: "You cannot delete your own account" });
    }

    await deleteUserByIdService(userId);

    return res.status(200).redirect("/api/users");
  } catch (err) {
    logger.error(`Error deleting user
      ${err.stack}
    `);
    return res.status(500).json({ message: "Error deleting user" });
  }
};