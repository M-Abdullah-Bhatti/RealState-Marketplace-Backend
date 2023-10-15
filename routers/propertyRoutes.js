const {
  registerProperty,
  getAllActiveProperty,
  getAllPendingProperty,
  updatePropertyStatus,
  postPropertyAd,
  getAllPropertyAds,
  checkToBuyPropertyToken,
  buyPropertyToken,
  getAllRentListing,
  rentAllPropertyOwners,
  getPropertyDetail,
  getAllMyPendingProperties,
  getAllMyActiveProperties,
  getAllPropertiesCities
} = require("../controllers/propertyController");

//    const {isAuthenticatedUser, isAdmin} = require("../middleware/authenticate")

const router = require("express").Router();

router.post("/register", registerProperty);
router.get("/active", getAllActiveProperty);
router.get("/pending", getAllPendingProperty);
router.get("/property-detail", getPropertyDetail);
router.get("/properties", getAllPropertyAds);
router.get("/rent-listing", getAllRentListing);
router.get("/my-pending", getAllMyPendingProperties);
router.get("/my-active", getAllMyActiveProperties);
router.put("/update-status", updatePropertyStatus);
router.post("/post-ad", postPropertyAd);
router.post("/check-buy", checkToBuyPropertyToken);
router.post("/buy-token", buyPropertyToken);
router.put("/fundAllOwners", rentAllPropertyOwners);
router.get("/cities", getAllPropertiesCities);


module.exports = router;
