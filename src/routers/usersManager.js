import { Router } from "express";
import { isAdmin } from "../middleware/admin.middleware.js";
import { usersManagerController } from "../controllers/users-manager/usersManager.controller.js";

const router = Router();
router.get("/", isAdmin, usersManagerController.getUsers);

router.get(
  "/update-user-role/:userId",
  isAdmin,
  usersManagerController.updateUserRole
);
router.post(
  "/update-user-role/:userId",
  isAdmin,
  usersManagerController.updateUsersRolePost
);
router.post(
  "/delete-inactive-users",
  isAdmin,
  usersManagerController.deleteInactiveUsers
);

router.post(
  "/delete-user/:userId",
  isAdmin,
  usersManagerController.deleteUser
);


export default router;