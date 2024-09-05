import { Router } from "express";
import { allMenuData } from "../controllers/menu.controller.js";

const router = Router();

// all menu router
router.route("/alldata").get(allMenuData);

export default router;
