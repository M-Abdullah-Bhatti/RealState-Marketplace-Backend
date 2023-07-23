const Property = require("../models/PropertyModel");
const cloudinary = require("cloudinary");

module.exports.registerProperty = async (req, res, next) => {
  try {
    const property = await Property.create(req.body);

    if (property) {
      return res.status(200).json({ success: true, property });
    } else {
      return res.status(400).json({ success: false });
    }
  } catch (ex) {
    return res.json({ success: false, error: ex.message });
    next(ex);
  }
};
