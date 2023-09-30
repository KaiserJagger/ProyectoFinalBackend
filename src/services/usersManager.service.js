import UserModel from "../dao/models/user.model.js";

export const getUserById = async (userId) => {
  try {
    const user = await UserModel.findById(userId).lean();
    return user;
  } catch (err) {
    throw err;
  }
};

export const updateUserRoleService = async (userId, newRole) => {
  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.role = newRole;

    await user.save();

    return user;
  } catch (err) {
    throw err;
  }
};

export const deleteInactiveUsersService = async (adminEmail) => {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setMinutes(twoDaysAgo.getMinutes() - 20); // 2880 = 2 days

    const usersToDelete = await UserModel.find({
      last_login: { $lt: twoDaysAgo },
    });

    const deletedUserEmails = usersToDelete.map((user) => user.email);

    const deletedUsers = await UserModel.deleteMany({
      last_login: { $lt: twoDaysAgo },
    });

    return { deletedCount: deletedUsers.deletedCount, deletedUserEmails };
  } catch (err) {
    throw err;
  }
};

export const deleteUserByIdService = async (userId) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    return deletedUser;
  } catch (err) {
    throw err;
  }
};