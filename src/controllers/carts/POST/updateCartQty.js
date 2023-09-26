import { updateCartQtyService } from "../../../services/carts.service.js";
import logger from "../../../utils/logger.js";

export const updateCartQty = async (req, res) => {
  const { cartId, productId, quantity } = req.body;

  try {
    const cart = await updateCartQtyService(cartId, productId, quantity);

    if (cart === null) {
      logger.warning(`${productId} out of stock`);

      return res.render("errors/stockError", {
        message:
          "There is not enough stock for this product or the value entered is correct",
      });
    }

    res.redirect("/api/carts");
  } catch (err) {
    logger.error(`
      An error occurred while updating the product quantity
      ${err.stack}  
    `);
    res.status(500).json({
      error: "An error occurred while updating the product quantity.",
    });
  }
};
