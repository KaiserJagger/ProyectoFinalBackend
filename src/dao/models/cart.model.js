import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
    default: [],
  },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
