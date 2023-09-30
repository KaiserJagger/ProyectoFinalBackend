import { updateUserRoleService } from "../../../services/usersManager.service.js";
import logger from "../../../utils/logger.js";

export const updateUsersRolePost = async (req, res) => {
  const userId = req.params.userId;
  const { newRole } = req.body;

  try {
      const updatedUser = await updateUserRoleService(userId, newRole);

      if (!updatedUser) {
          return res.status(404).send("User not found");
      }

      res.redirect(`/api/users/update-user-role/${userId}`);
  } catch (err) {
      logger.error(`
        Error while updating user role.
        ${err.stack}
      `);
      res.status(500).send("Error updating user role");
  }
};