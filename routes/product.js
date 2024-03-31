const { check } = require("express-validator");
const {
  CreateProduct,
  GetProducts,
  UpdateProducts,
  DeleteProduct,
  getProductId,
} = require("../controller/product");
const { Router } = require("express");
const checkAuth = require('../middleware/auth-check');
const uploadMiddleware = require('../middleware/multipleimage');
const storage = require('../middleware/image');
const router = Router();
const multer = require('multer');
const upload = multer({ storage: storage });

router.post("/create", checkAuth, upload.any("image"), CreateProduct);
router.get("", checkAuth, GetProducts);
router.get("/:id", checkAuth, getProductId);
router.put("/:id", checkAuth, upload.any("image"), UpdateProducts);
router.delete("/:id", checkAuth, DeleteProduct);

module.exports = router;
