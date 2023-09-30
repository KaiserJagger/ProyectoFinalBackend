import UserModel from "../../../dao/models/user.model.js";
import logger from "../../../utils/logger.js";

export const changeRole = async (req, res) => {
  const { newRole } = req.body;
  const userRole = req.role;
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "admin") {
      logger.warning(`Cannot change the role of an admin - (${user.email})`);
      return res.render("errors/error-admin-role");
    }

    user.role = newRole;
    await user.save();
    logger.info(`Changed role of user to ${newRole} - (${user.email})`);
    if (userRole === "admin") {
      return res.redirect("/api/users");
    } else {
      return res.redirect("/api/user");
    }
  } catch (error) {
    console.error(error);
    res.render("errors/500");
  }
};
