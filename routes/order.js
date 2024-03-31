const { check } = require("express-validator");
const {
  getOrders
} = require("../controller/order");
const { Router } = require("express");
const checkAuth = require('../middleware/auth-check');
const router = Router();

router.post("/", checkAuth, getOrders);
router.post("/checkout", checkAuth, orderCheckout);

module.exports = router;
