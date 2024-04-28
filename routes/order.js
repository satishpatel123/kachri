const { check } = require("express-validator");
const {
  getOrders,
  createOrder,
  createOrderShipping,
  getAllOrders,
} = require("../controller/order");
const { Router } = require("express");
const checkAuth = require("../middleware/auth-check");
const router = Router();
const storage = require("../middleware/image");
const multer = require("multer");
const upload = multer({ storage: storage });

router.get("/", checkAuth, getOrders);
router.get("/all", checkAuth, getAllOrders);

router.post("/", checkAuth, createOrder);
router.post("/shipping", checkAuth, createOrderShipping);

module.exports = router;
