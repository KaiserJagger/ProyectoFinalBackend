import { deleteProduct } from "./DELETE/deleteProduct.js";
import { getProductsManager } from "./GET/getProductsManager.js";
import { updateProduct } from "./POST/updateProduct.js";

export const productManager = {
  deleteProduct,
  getProductsManager,
  updateProduct,
};
