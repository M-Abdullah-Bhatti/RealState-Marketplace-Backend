const {
  registerProperty,
  getAllActiveProperty,
  getAllPendingProperty,
  updatePropertyStatus,
} = require("../controllers/propertyController");

//    const {isAuthenticatedUser, isAdmin} = require("../middleware/authenticate")

const router = require("express").Router();

router.post("/register", registerProperty);
router.get("/active", getAllActiveProperty);
router.get("/pending", getAllPendingProperty);
router.put("/update-status", updatePropertyStatus);

// router.post("/login", login);
// router.get("/all_users", isAdmin, getAllUsers);
// router.get("/all_pending_users", isAdmin, getAllPendingUsers);

module.exports = router;
