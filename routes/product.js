const { check } = require("express-validator");
const {
  CreateProduct,
  GetProducts,
  UpdateProducts,
  DeleteProduct,
  getProductId,
  GetAdminProducts,
} = require("../controller/product");
const { Router } = require("express");
const router = Router();
const checkAuth = require("../middleware/auth-check");
const storage = require("../middleware/image");
const multer = require("multer");
const upload = multer({ storage: storage });

router.post("/create", checkAuth, upload.any("image"), CreateProduct);
router.get("", GetProducts);
router.get("/admin", checkAuth, GetAdminProducts);
router.get("/:id", getProductId);
router.put("/:id", checkAuth, upload.any("image"), UpdateProducts);
router.delete("/:id", checkAuth, DeleteProduct);

module.exports = router;
