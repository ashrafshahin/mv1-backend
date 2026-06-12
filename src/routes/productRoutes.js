const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { createProductController, getMyProductsController } = require("../controllers/productController");

router.use(protect);

// vendor routes
router.post('/create-product', restrictTo('vendor'), createProductController);
router.get('/my-products', restrictTo('vendor'), getMyProductsController);

module.exports = router;

