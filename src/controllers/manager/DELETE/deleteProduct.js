import productManager from "../../../dao/manager/products.manager.js";
import logger from "../../../utils/logger.js";

export const deleteProduct = async (req, res) => {
  const { productId } = req.body;
  const user = req.user;

  try {
    const product = await productManager.deleteProduct(productId);

    if (!product) {
      return res.status(404).json({ err: "Product not found" });
    }

    if (user.role === "admin" || product.owner === user.email) {
      await productManager.deleteProduct(productId);
      logger.info(`Product ${productId} deleted`);
      return res.redirect("/api/products");
    } else {
      logger.warning(
        `Permission denied to delete product. ${user.email} is not the owner of the product (${productId}) `
      );
      return res.status(403).render("errors/owner-denied");
    }
  } catch (err) {
    logger.error(`
      An error occurred while deleting the product from the database.
      ${err.stack}  
    `);
    res.status(500).json({
      err: "An error occurred while deleting the product from the database.",
    });
  }
};
