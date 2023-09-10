const {
  registerProperty,
  getAllActiveProperty,
  getAllPendingProperty,
  updatePropertyStatus,
  buyPropertyToken,
} = require("../controllers/propertyController");

//    const {isAuthenticatedUser, isAdmin} = require("../middleware/authenticate")

const router = require("express").Router();

router.post("/register", registerProperty);
router.get("/active", getAllActiveProperty);
router.get("/pending", getAllPendingProperty);
router.put("/update-status", updatePropertyStatus);
router.put("/buy-token", buyPropertyToken);

// router.post("/login", login);
// router.get("/all_users", isAdmin, getAllUsers);
// router.get("/all_pending_users", isAdmin, getAllPendingUsers);

module.exports = router;
