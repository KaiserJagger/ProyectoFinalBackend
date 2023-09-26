import Cart from "../dao/models/cart.model.js";
import cartModel from "../dao/models/cart.model.js";
import productModel from "../dao/models/product.model.js";
import ticketModel from "../dao/models/ticket.models.js";
import logger from "../utils/logger.js";
import UserModel from "../dao/models/user.model.js";
import { CustomError } from "./errors/custom_errors.js";
import EErros from "./errors/enums.js";

export const getCartsService = async (userId) => {
  try {
    const user = await UserModel.findById(userId).lean().exec();
    if (!user) {
      throw new CustomError({
        name: "UserNotFoundError",
        message: "User not found",
        code: EErros.ERROR_GET_CARTS,
      });
    }

    const cart = await Cart.findById(user.cart)
      .populate("products.productId")
      .lean()
      .exec();

    return cart;
  } catch (err) {
    logger.error(`
      An error occurred when obtaining the carts.
      ${err.stack}  
    `);
  }
};

export const addToCartService = async (productId, userId) => {
  try {
    const user = await UserModel.findById(userId).populate("cart").exec();

    if (!user) {
      throw new Error("User not found");
    }

    const cart = user.cart;

    if (!cart) {
      throw new CustomError({
        name: "UserNotFoundError",
        message: "User not found",
        code: EErros.ERROR_ADD_TO_CART,
      });
    }

    const existingProductIndex = cart.products.findIndex(
      (item) => item.productId && item.productId.toString() === productId
    );

    const product = await productModel.findById(productId);
    const stock = product.stock;

    if (existingProductIndex !== -1) {
      const existingProduct = cart.products[existingProductIndex];
      const totalQuantity = existingProduct.quantity + 1;

      if (totalQuantity > stock) {
        return stock;
      }

      cart.products[existingProductIndex].quantity = totalQuantity;
    } else {
      cart.products.push({ productId, quantity: 1 });
    }

    await cart.save();
    return cart;
  } catch (err) {
    logger.error(`
      Error adding item to cart.
      ${err.stack}  
    `);
  }
};

export const removeFromCartService = async (productId, userId) => {
  try {
    const user = await UserModel.findById(userId).populate("cart").exec();

    if (!user || !user.cart) {
      throw new Error("User or Cart does not exist");
    }

    const cart = user.cart;

    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    return cart;
  } catch (err) {
    logger.error(`
      Error removing item from cart.
      ${err.stack}  
    `);
  }
};

export const updateCartQtyService = async (cartId, productId, quantity) => {
  try {
    const cart = await cartModel.findById(cartId);

    if (!cart) {
      throw new CustomError({
        name: "Cart does not exist",
        message: "The cart does not exist",
        code: EErros.ERROR_GET_CARTS,
      });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
    } else {
      throw new Error("The product does not exist in the cart");
    }

    const product = await productModel.findById(productId);
    const stock = product.stock;

    if (quantity > stock || quantity <= 0) {
      return null;
    }

    await cart.save();
    return cart;
  } catch (err) {
    logger.error(`
      Error updating cart quantity 
      ${err.stack}  
    `);
  }
};

export const generateTicketService = async (purchase, purchaserEmail) => {
  try {
    const total = purchase.products.reduce(
      (sum, product) => sum + product.productId.price * product.quantity,
      0
    );

    const ticket = new ticketModel({
      amount: total,
      purchaser: purchaserEmail,
    });
    await ticket.save();

    for (const product of purchase.products) {
      await productModel.updateOne(
        { _id: product.productId._id },
        { $inc: { stock: -product.quantity } }
      );
    }

    await cartModel.updateOne(
      { _id: purchase._id },
      { $set: { products: [] } }
    );

    return ticket.toObject();
  } catch (err) {
    logger.error(`
      Error generating ticket.
      ${err.stack}  
    `);
  }
};
