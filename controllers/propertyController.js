const Property = require("../models/PropertyModel");
const cloudinary = require("cloudinary");

module.exports.registerProperty = async (req, res, next) => {
  try {
    if (!walletAddress) {
      return res
        .status(400)
        .json({ status: false, message: "wallet address is not given" });
    }
    let owner = [
      {
        ownerAddress: req.body.walletAddress,
        tokenHolder: req.body.totalTokens,
        perTokenPrice: req.body.tokenPrice,
      },
    ];
    req.body.propertyOwner = owner;
    const property = await Property.create(req.body);

    if (property) {
      return res.status(200).json({ success: true, property });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
    next(ex);
  }
};

module.exports.getAllActiveProperty = async (req, res, next) => {
  try {
    const property = await Property.find({ propertyStatus: "active" });
    return res.json({ status: true, property });
  } catch (error) {
    return res.json({ status: false, message: error.message });
    next(ex);
  }
};

module.exports.getAllPendingProperty = async (req, res, next) => {
  try {
    const property = await Property.find({ propertyStatus: "pending" });
    return res.json({ status: true, property });
  } catch (error) {
    return res.json({ status: false, message: error.message });
    next(ex);
  }
};

module.exports.updatePropertyStatus = async (req, res, next) => {
  try {
    const { id } = req.body;
    console.log({ id });
    const property = await Property.findById(id);

    if (!property) {
      return res.json({ status: false, message: "Property not found" });
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.json({ status: true, user: updatedProperty });
  } catch (error) {
    return res.json({ status: false, message: error.message });
    next(ex);
  }
};
