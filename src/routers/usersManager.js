import { Router } from "express";
import { isAdmin } from "../middleware/admin.middleware.js";
import UserModel from "../dao/models/user.model.js";
import logger from "../utils/logger.js";
import { deleteAccountMailer } from "../utils/deleteMailer.js";

const router = Router();

router.get("/", isAdmin, async (req, res) => {
  const user = req.user;
  const users = await UserModel.find().lean();

  logger.http(`/api/users (admin dashboard) ${user.email}`);
  res.status(200).render("users-manager", { users });
});

router.get("/update-user-role/:userId", isAdmin, async (req, res) => {
  const userId = req.params.userId;
  const email = req.user.email;

  try {
    const user = await UserModel.findById(userId).lean();

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
    console.log(err);
  }
});

router.post("/update-user-role/:userId", isAdmin, async (req, res) => {
  const userId = req.params.userId;
  const { newRole } = req.body;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.role = newRole;

    await user.save();

    res.redirect(`/api/users/update-user-role/${userId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating user role");
  }
});

router.post("/delete-inactive-users", isAdmin, async (req, res) => {
  const adminEmail = req.user.email;
  try {
    const twentyMinutesAgo = new Date();
    twentyMinutesAgo.setMinutes(twentyMinutesAgo.getMinutes() - 1);

    const usersToDelete = await UserModel.find({
      last_login: { $lt: twentyMinutesAgo },
    });

    const deletedUserEmails = usersToDelete.map((user) => user.email);

    const deletedUsers = await UserModel.deleteMany({
      last_login: { $lt: twentyMinutesAgo },
    });

    logger.info(
      `Admin (${adminEmail}) deleted ${deletedUsers.deletedCount} inactive users.`
    );

    deletedUserEmails.forEach(async (email) => {
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
});

export default router;