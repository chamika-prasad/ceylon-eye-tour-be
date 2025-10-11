import express from "express";
import packageController from "../controllers/package.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get(
  "/get-all",
  // tokenMiddleware.verifyToken,
  packageController.getPackages
);

router.get(
  "/get-by-id/:id",
  // tokenMiddleware.verifyToken,
  packageController.getPackageById
);

router.get(
  "/get-by-urlprefix/:urlPrefix",
  // tokenMiddleware.verifyToken,
  packageController.getPackageByUrlPrefix
);

router.post(
  "/add",
  // tokenMiddleware.verifyToken,
  upload.array("images", 10),
  packageController.addPackage
);

router.put(
  "/update/:id",
  tokenMiddleware.verifyToken,
  tokenMiddleware.authorizeAdmin,
  upload.array("images", 10),
  packageController.updatePackage
);

export default router;
