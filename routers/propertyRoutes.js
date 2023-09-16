const {
  registerProperty,
  getAllActiveProperty,
  getAllPendingProperty,
  updatePropertyStatus,
  postPropertyAd,
  getAllPropertyAds,
  checkToBuyPropertyToken,
  buyPropertyToken,
} = require("../controllers/propertyController");

//    const {isAuthenticatedUser, isAdmin} = require("../middleware/authenticate")

const router = require("express").Router();

router.post("/register", registerProperty);
router.get("/active", getAllActiveProperty);
router.get("/pending", getAllPendingProperty);
router.put("/update-status", updatePropertyStatus);
router.post("/post-ad", postPropertyAd);
router.get("/properties", getAllPropertyAds);
router.post("/check-buy", checkToBuyPropertyToken);
router.post("/buy-token", buyPropertyToken);

module.exports = router;
