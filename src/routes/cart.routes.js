import { Router } from "express";
import { addCart } from "../controllers/cart.controller.js";

const router = Router();

//all cart router
router.route("/addcart").post(addCart);
export default router;
