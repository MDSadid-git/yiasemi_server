import { Router } from "express";
import {
  addItems,
  allMenuData,
  deleteItem,
  singleMenuData,
  updateItem,
} from "../controllers/menu.controller.js";
import { verifyAdmin } from "../middlewares/AdminChick.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewars.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

// all menu router
router.route("/alldata").get(allMenuData);
router
  .route("/admin/update/item")
  .patch(verifyJWT, verifyAdmin, upload.single("image"), updateItem);
router.route("/admin/item/:id").get(verifyJWT, verifyAdmin, singleMenuData);
router.route("/admin/item/:id").delete(verifyJWT, verifyAdmin, deleteItem);
router
  .route("/admin/item")
  .post(verifyJWT, verifyAdmin, upload.single("image"), addItems);

export default router;
