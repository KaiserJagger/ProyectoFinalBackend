import mongoose from "mongoose";

const userPasswordCollection = "userPasswords";

const userPasswordSchema = new mongoose.Schema({
  email: { type: String, ref: "users" },
  token: { type: String, required: true },
  isUsed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

mongoose.set("strictQuery", false);

userPasswordSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

const UserPasswordModel = mongoose.model(
  userPasswordCollection,
  userPasswordSchema
);

export default UserPasswordModel;
