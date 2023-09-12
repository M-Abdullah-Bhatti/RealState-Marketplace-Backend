const PropertyAd = require("../models/propertyAd");
const Property = require("../models/PropertyModel");

module.exports.postPropertyAd = async (req, res, next) => {
  try {
    const { walletAddress, propertyId, userId } = req.body;
    let matchedLenght = 0;

    if ((!walletAddress, !propertyId, !userId)) {
      return res
        .status(400)
        .json({ status: false, message: "Insufficient Credientials" });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        status: false,
        message: "Property with this id is not found!",
      });
    }

    property.propertyOwner.forEach((item) => {
      console.log("item: ", item);
      if (walletAddress === item.ownerAddress) {
        matchedLenght += 1;
      }
    });

    if (matchedLenght === 0) {
      return res.status(404).json({
        status: false,
        message: "You are not the owner of this property!",
      });
    }

    const propertyAd = await PropertyAd.create(req.body);

    if (propertyAd) {
      return res.status(200).json({ success: true, propertyAd });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
    next(ex);
  }
};

module.exports.getAllPostedPropertyAds = async (req, res, next) => {
  try {
    const propertyAd = await PropertyAd.find();

    if (!propertyAd) {
      return res
        .status(404)
        .json({ status: false, message: "No property ads right now found!" });
    }

    // Use Promise.all to fetch properties for all propertyAds
    const propertyArray = await Promise.all(
      propertyAd.map(async (item) => {
        const property = await Property.findById(item.propertyId);

        // Check if the property is active before including it in the result
        if (property && property.propertyStatus === "active") {
          return property;
        } else {
          return null; // Exclude non-active properties
        }
      })
    );

    // Remove null values (non-active properties) from the propertyArray
    const activeProperties = propertyArray.filter(
      (property) => property !== null
    );

    if (!activeProperties.length) {
      return res
        .status(404)
        .json({ status: false, message: "No active properties found!" });
    }

    return res
      .status(200)
      .json({ status: true, propertyArray: activeProperties });
  } catch (error) {
    return res.json({ status: false, message: error.message });
    next(ex);
  }
};

// module.exports.getAllPendingProperty = async (req, res, next) => {
//   try {
//     const property = await Property.find({ propertyStatus: "pending" });
//     return res.json({ status: true, property });
//   } catch (error) {
//     return res.json({ status: false, message: error.message });
//     next(ex);
//   }
// };

// module.exports.updatePropertyStatus = async (req, res, next) => {
//   try {
//     const { id } = req.body;
//     console.log({ id });
//     const property = await Property.findById(id);

//     if (!property) {
//       return res.json({ status: false, message: "Property not found" });
//     }

//     const updatedProperty = await Property.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });

//     return res.json({ status: true, user: updatedProperty });
//   } catch (error) {
//     return res.json({ status: false, message: error.message });
//     next(ex);
//   }
// };
