const {
  registerProperty,
  getAllActiveProperty,
  getAllPendingProperty,
  updatePropertyStatus,
  postPropertyAd,
} = require("../controllers/propertyController");

//    const {isAuthenticatedUser, isAdmin} = require("../middleware/authenticate")

const router = require("express").Router();

router.post("/register", registerProperty);
router.get("/active", getAllActiveProperty);
router.get("/pending", getAllPendingProperty);
router.put("/update-status", updatePropertyStatus);
router.post("/post-ad", postPropertyAd);

// router.post("/login", login);
// router.get("/all_users", isAdmin, getAllUsers);
// router.get("/all_pending_users", isAdmin, getAllPendingUsers);

module.exports = router;
