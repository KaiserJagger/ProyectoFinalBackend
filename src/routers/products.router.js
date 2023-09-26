import { Router } from "express";
import { productController } from "../controllers/products/product.controller.js";
import { productManager } from "../controllers/manager/product.manager.controller.js";
import logger from "../utils/logger.js";
import { isPremium } from "../middleware/premium.middleware.js";


const router = Router();

router.get("/create", isPremium, async (req, res) => {
  logger.http("GET /create");
  res.render("create");
});


router.get('/update-product/:productId', productManager.getProductsManager);

router.get("/:manager?", productController.getProducts);

router.post('/update-products/:productId', productManager.updateProduct);

router.post("/", productController.createProduct);

router.post("/delete-product", productManager.deleteProduct);

router.get("/mockingproducts", productController.getMocking);

export default router;
