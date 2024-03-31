const { check } = require("express-validator");
const {
  CreateUser,
  GetUser,
  UpdateUser,
  DeleteUser,
  getUserId,
  loginUser,
  registerUser,
  changepassword
} = require("../controller/user");
const checkAuth = require('../middleware/auth-check')
const { Router } = require("express");
const router = Router();

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
router.get("/users", checkAuth, GetUser);
router.get("/:id", checkAuth, getUserId);
router.put("/:id", checkAuth, UpdateUser);
router.delete("/:id", checkAuth, DeleteUser);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/changepassword", checkAuth, changepassword);

module.exports = router;
