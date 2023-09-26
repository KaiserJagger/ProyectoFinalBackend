import UserModel from "../dao/models/user.model.js";

export const getUserService = async (user) => {
  const userData = {
    email: user.email,
    name: user.first_name,
    surname: user.last_name,
    role: user.role,
  };

  return userData;
};

