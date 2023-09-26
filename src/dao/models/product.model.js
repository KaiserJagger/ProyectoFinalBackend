import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
    default: "admin",
  },
  thumbnail: [String],
});

productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model("products", productSchema);

export default productModel;
