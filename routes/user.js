const { check } = require("express-validator");
const {
  CreateUser,
  GetUser,
  UpdateUser,
  DeleteUser,
  getUserId,
  loginUser,
  registerUser,
  changepassword,
  contactUs,
  forgetpassword,
  resetPassword,
  socialLogin,
  mobileUpdate
} = require("../controller/user");
const checkAuth = require('../middleware/auth-check')
const { Router } = require("express");
const router = Router();

router.get("/", CreateUser);
router.get("/users", checkAuth, GetUser);
router.get("/:id", checkAuth, getUserId);
router.put("/:id", checkAuth, UpdateUser);
router.delete("/:id", checkAuth, DeleteUser);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/changepassword", checkAuth, changepassword);
router.post("/contactUs", contactUs);
router.post("/mobileUpdate", checkAuth , mobileUpdate);
router.post("/forgetpassword", forgetpassword);
router.post("/resetPassword/:token", resetPassword);
router.post("/socialLogin", socialLogin);

module.exports = router;
