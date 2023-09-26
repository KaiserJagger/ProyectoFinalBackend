import mongoose from "mongoose";

const GithubModel = mongoose.model(
  "github",
  mongoose.Schema({
    email: String,
    first_name: String,
  })
);

export default GithubModel;
