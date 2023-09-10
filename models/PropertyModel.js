const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },

  // category must be in of the following: house, plot, flat, shops, commercial

  propertyStatus: {
    type: String,
    default: "pending",
  },

  description: {
    type: String,
    required: true,
  },

  area: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  orienten: {
    type: String,
    require: true,
  },

  // orienten must be in of the following: north, south, east, west

  bedroom: {
    type: Number,
  },

  washroom: {
    type: Number,
  },

  kitchen: {
    type: Number,
  },

  totalTokens: {
    type: Number,
    required: true,
  },

  tokenPrice: {
    type: Number,
    required: true,
  },

  propertyOwner: [
    {
      ownerAddress: {
        type: String,
        required: true,
      },
      tokenHolder: {
        type: String,
        required: true,
      },
      perTokenPrice: {
        type: String,
      },
    },
  ],

  // ignore the images and property doc image for now

  // images: [
  //   {
  //     public_id: {
  //       type: String,
  //       required: true,
  //     },
  //     url: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  // ],

  // propertyDocument: {
  //   public_id: {
  //     type: String,
  //     required: true,
  //   },
  //   url: {
  //     type: String,
  //     required: true,
  //   },
  // },
});

module.exports = mongoose.model("Property", propertySchema);
