import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  role: {
    type: String,
    enum: ["admin", "premium", "user"],
    default: "user",
  },
  last_login:{
    type: Date,
    default: Date.now,
  },
});

mongoose.set("strictQuery", false);
const UserModel = mongoose.model(userCollection, userSchema);

export default UserModel;
