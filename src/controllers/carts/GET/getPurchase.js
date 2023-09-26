import logger from "../../../utils/logger.js";
import {
  getCartsService,
  generateTicketService,
} from "../../../services/carts.service.js";

export const getPurchase = async (req, res) => {
  try {
    const userId = req.user.id;
    const purchases = await getCartsService(userId);
    const purchase = purchases;

    if (!purchase || !purchase.products || purchase.products.length === 0) {
      const errorMessage = "El carrito está vacío. Agregue productos antes de continuar.";
      return res.render("carts", { message: errorMessage });
    }

    const ticket = await generateTicketService(purchase, req.user.email);

    res.status(200).render("purchase", { purchase, ticket, message: null });
  } catch (err) {
    logger.error(`
      An error occurred when obtaining the purchase
      ${err.stack}  
    `);
    res.status(500).json({ err: "An error occurred when obtaining the purchase" });
  }
};
