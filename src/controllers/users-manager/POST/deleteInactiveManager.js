import { deleteInactiveUsersService } from "../../../services/usersManager.service.js";
import { deleteAccountMailer } from "../../../utils/deleteMailer.js";
import logger from "../../../utils/logger.js";

export const deleteInactiveUsers = async (req, res) => {
  const adminEmail = req.user.email;

  try {
    const result = await deleteInactiveUsersService(adminEmail);

    logger.info(
      `Admin (${adminEmail}) deleted ${result.deletedCount} inactive users.`
    );

    result.deletedUserEmails.forEach(async (email) => {
      await deleteAccountMailer(email);
    });

    res.status(200).redirect("/api/users");
  } catch (err) {
    logger.error(`
        An error occurred while deleting inactive users.
        ${err.stack} 
      `);
    res
      .status(500)
      .json({ err: "An error occurred while deleting inactive users." });
  }
};