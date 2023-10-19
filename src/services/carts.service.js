import Cart from "../dao/models/cart.model.js";
import cartModel from "../dao/models/cart.model.js";
import productModel from "../dao/models/product.model.js";
import ticketModel from "../dao/models/ticket.models.js";
import logger from "../utils/logger.js";
import UserModel from "../dao/models/user.model.js";
import { CustomError } from "./errors/custom_errors.js";
import EErros from "./errors/enums.js";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { GMAIL_CONFIG } from "../config/config.js";

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

    const productsInfo = purchase.products.map((product) => ({
      name: product.productId.title,
      quantity: product.quantity,
      price: product.productId.price,
    }));

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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_CONFIG.user, pass: GMAIL_CONFIG.pass },
    });

    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "JaggerStore-Informatica",
        link: "jaggerstore-production-c4a6.up.railway.app",
      },
    });

    const email = {
      body: {
        name: purchaserEmail,
        intro: "Your purchase receipt",
        table: {
          data: productsInfo.map((productInfo) => ({
            item: `${productInfo.name} (Cantidad: ${productInfo.quantity})`,
            description: `$${(productInfo.quantity * productInfo.price).toFixed(
              2
            )}`,
          })),
        },
        outro: `
        Total Amount: $${total.toFixed(2)}.\n
        Thanks for shopping with us!\n
        Need help, or have questions? Just reply to this email, we'd love to help`,
      },
    };

    const emailBody = mailGenerator.generate(email);

    const emailOptions = {
      from: GMAIL_CONFIG.user,
      to: purchaserEmail,
      subject: "Purchase receipt",
      html: emailBody,
    };

    await transporter.sendMail(emailOptions);

    return ticket.toObject();
  } catch (err) {
    logger.error(`
      Error generating ticket.
      ${err.stack}  
    `);
  }
};
