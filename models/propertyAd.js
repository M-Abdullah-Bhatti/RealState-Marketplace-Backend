const mongoose = require("mongoose");

const propertAdSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "property",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

module.exports = mongoose.model("PropertyAd", propertAdSchema);
