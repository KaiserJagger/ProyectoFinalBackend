import { Router } from "express";
import { cartController } from "../controllers/carts/cart.controller.js";

const router = Router();

router.get("/", cartController.getCarts);

router.post("/add-to-cart", cartController.addToCart);

router.post("/remove-from-cart", cartController.removeFromCart);

router.post("/update-quantity", cartController.updateCartQty);

router.get("/purchase", cartController.getPurchase);

export default router;
