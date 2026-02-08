const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// IMPORTANT: "/" MUST COME FIRST
router.get("/", productController.getAllProducts);
router.post("/", productController.createProduct);

router.get("/:id", productController.getProductById);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
