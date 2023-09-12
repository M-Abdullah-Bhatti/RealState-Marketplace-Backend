const {
  postPropertyAd,
  getAllPostedPropertyAds,
} = require("../controllers/propertAdController");

//    const {isAuthenticatedUser, isAdmin} = require("../middleware/authenticate")

const router = require("express").Router();

router.post("/post-ad", postPropertyAd);
router.get("/property-ad", getAllPostedPropertyAds);

module.exports = router;
