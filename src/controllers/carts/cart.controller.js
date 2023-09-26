import { addToCart } from "./POST/addToCart.js";
import { updateCartQty } from "./POST/updateCartQty.js";
import { removeFromCart } from "./POST/removeFromCart.js";
import { getCarts } from "./GET/getCarts.js";
import { getPurchase } from "./GET/getPurchase.js";

export const cartController = {
  addToCart,
  updateCartQty,
  removeFromCart,
  getCarts,
  getPurchase,
};
