import { addToCartService } from "../../../services/carts.service.js";
import productModel from "../../../dao/models/product.model.js";
import logger from "../../../utils/logger.js";

export const addToCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const product = await productModel.findById(productId);

    if (userRole === "admin" || req.user.email === product.owner) {
      logger.warning(
        "Cannot add your own product | admin users cannot add products to cart"
      );
      return res.status(403).render("errors/owner-admin");
    }

    const cart = await addToCartService(productId, userId);

    logger.info(`Product ${productId} added to cart`);

    res.redirect("/api/products");
  } catch (err) {
    logger.error(`
      An error occurred while adding the product to the cart
      ${err.stack}  
    `);
    res.status(500).json({
      err:
        err.message || "An error occurred while adding the product to the cart",
    });
  }
};
