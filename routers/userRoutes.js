const {
  register,
  login,
  getAllUsers,
  getMyProfile,
  editMyProfile
} = require("../controllers/userController");

const { isAuthenticatedUser, isAdmin } = require("../middleware/authenticate");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/all-users", getAllUsers);
router.get("/profile", getMyProfile);
router.put("/profile-update/:userId", editMyProfile);

// router.get("/all-users", isAdmin, getAllUsers);
//   router.get("/all_pending_users",isAdmin, getAllPendingUsers);
//   router.put("/update_user_status",isAdmin, updateUserStatus);

module.exports = router;
