const { check } = require("express-validator");
const {
  CreateUser,
  GetUser,
  UpdateUser,
  DeleteUser,
  getUserId,
  loginUser
} = require("../controller/user");
const { Router } = require("express");
const router = Router();

router.route("").get(GetUser);
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
  CreateUser
);
router.route("/:id").get(getUserId);
router.route("/:id").put(UpdateUser);
router.route("/:id").delete(DeleteUser);
router.post("/login", loginUser);
router.post("/register", registerUser);

module.exports = router;
