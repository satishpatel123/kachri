const { check } = require("express-validator");
const {
  getCartId,
  addToCart,
  deleteCart
} = require("../controller/cart");
const { Router } = require("express");
const checkAuth = require('../middleware/auth-check');
const router = Router();

router.post("/addToCart", checkAuth, addToCart);
router.post("/deleteCart", checkAuth, deleteCart);
router.get("/:userId", checkAuth, getCartId);

module.exports = router;
