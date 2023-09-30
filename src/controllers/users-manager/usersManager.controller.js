import { getUsers } from "./GET/getUsersManager.js";
import { updateUserRole } from "./GET/getUpdateManager.js";
import { updateUsersRolePost } from "./POST/updateUserRoleManager.js";
import { deleteInactiveUsers } from "./POST/deleteInactiveManager.js";
import { deleteUser } from "./POST/deleteUserManager.js";

export const usersManagerController = {
  getUsers,
  updateUserRole,
  updateUsersRolePost,
  deleteInactiveUsers,
  deleteUser,
};
