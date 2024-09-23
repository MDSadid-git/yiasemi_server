import { Router } from "express";
import {
  addCart,
  cartItemDelete,
  userOrderFoodItems,
} from "../controllers/cart.controller.js";

const router = Router();

//all cart router
router.route("/addcart").post(addCart);
router.route("/user-orders-foods").get(userOrderFoodItems);
router.route("/cart/:id").delete(cartItemDelete);
export default router;
