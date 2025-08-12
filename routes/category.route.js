import express from "express";
import categoryController from "./../controllers/category.controller.js";
import tokenMiddleware from "./../middlewares/token.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get(
  "/get-all",
  // tokenMiddleware.verifyToken,
  categoryController.getCategories
);

router.get("/get-by-id/:categoryId", categoryController.getCategoryById);

router.get(
  "/get-by-urlprefix/:urlPrefix",
  // tokenMiddleware.verifyToken,
  categoryController.getCategoryByUrlPrefix
);

router.post(
  "/create",
  // tokenMiddleware.verifyToken,
  upload.single("image"),
  categoryController.createCategory
);

router.put(
  "/update/:id",
  // tokenMiddleware.verifyToken,
  categoryController.updateCategory
);

router.delete(
  "/delete/:id",
  // tokenMiddleware.verifyToken,
  categoryController.deleteCategory
);

export default router;
