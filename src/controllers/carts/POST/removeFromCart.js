import { removeFromCartService } from "../../../services/carts.service.js";
import logger from "../../../utils/logger.js";

export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    const cart = await removeFromCartService(productId, userId);

    logger.info(`${productId} has been removed from the cart`);

    res.redirect("/api/products");
  } catch (err) {
    logger.error(`
      An error occurred while removing the product from the cart
      ${err.stack}  
    `);
    res.status(500).json({
      error: "An error occurred while removing the product from the cart.",
    });
  }
};
