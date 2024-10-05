const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  resetPassword,
  requestPasswordReset
} = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser); //register user
router.post("/login", loginUser); //login user
router.get("/users", getAllUsers); // get all users
router.get("/user/:id",authMiddleware, getSingleUser); // get single user by id
router.put("/user/:id", updateUser); // update user
router.delete("/user/:id", deleteUser); // delete user
router.post("/password-reset", requestPasswordReset); //req reset password gmail
router.put("/reset-password/:resetToken", resetPassword); // reset password

module.exports = router;
