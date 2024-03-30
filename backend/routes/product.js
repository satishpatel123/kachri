const { check } = require("express-validator");
const {
  CreateProduct,
  GetProducts,
  UpdateProducts,
  DeleteProduct,
} = require("../controller/product");
const { Router } = require("express");
const router = Router();

router.route("").get(GetProducts);
router.route("").post(
  check("title", "title is required and should be between 3 to 30 characters")
    .notEmpty()
    .isLength({
      min: 3,
      max: 30,
    }),
  check(
    "description",
    "description is required and should be between 3 to 30 characters"
  )
    .notEmpty()
    .isLength({
      min: 3,
      max: 30,
    }),
  check("image", "image is required and should be between 3 to 20 characters")
    .notEmpty()
    .isLength({
      min: 3,
    }),
  check("price", "price is required and should be number").isNumeric(),
  CreateProduct
);
router.route("/:id").put(UpdateProducts);
router.route("/:id").delete(DeleteProduct);

module.exports = router;
