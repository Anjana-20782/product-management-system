import express from "express";

import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getReport
} from "../controllers/product.controller.js"; 

const router = express.Router();



router.get("/", getAllProducts);

router.post("/", addProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

router.get("/report", getReport);

export default router;
