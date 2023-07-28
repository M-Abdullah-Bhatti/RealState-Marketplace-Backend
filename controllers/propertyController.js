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


module.exports.updatePropertyStatus = async (req, res, next) => {
  try {
      const { email } = req.body;
      const prop = await Property.findOne({ email });
      if (!prop) {
          return res.json({ message: "Property not found", status: false });
      }

      const updatedProperty = await Property.findOneAndUpdate(
          { email: req.body.email }, req.body, { new: true });

      const propObject = updatedProperty.toObject();
      delete propObject.password;
      return res.json({ status: true, user: propObject });

  } catch (ex) {
      return res.json({ status: false, error: ex.message });
      next(ex);
  }
};

module.exports.getAllProperty = async (req, res, next) => {
  try {
      const props = await Property.find({ status: "active" });
      return res.json({ status: true, props });

  } catch (ex) {
      return res.json({ status: false, error: ex.message });
      next(ex);
  }
};

module.exports.getAllPendingProperty = async (req, res, next) => {
  try {
      const props = await Property.find({ status: "pending" });
      return res.json({ status: true, props });

  } catch (ex) {
      return res.json({ status: false, error: ex.message });
      next(ex);
  }
};