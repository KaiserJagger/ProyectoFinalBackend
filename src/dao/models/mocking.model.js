import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const mockingSchema = new mongoose.Schema({
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
    type: Boolean,
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
  thumbnail: [String],
});

mockingSchema.plugin(mongoosePaginate);
const MockingModel = mongoose.model("mockingproducts", mockingSchema);

export default MockingModel;
