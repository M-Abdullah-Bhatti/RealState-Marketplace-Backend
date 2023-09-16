const Property = require("../models/PropertyModel");
const cloudinary = require("cloudinary");

module.exports.registerProperty = async (req, res, next) => {
  try {
    // console.log("body: ", req.body);
    if (!req.body.walletAddress) {
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

module.exports.postPropertyAd = async (req, res, next) => {
  try {
    const { walletAddress, propertyId, tokensQuantity, tokenPrice } = req.body;
    let matchedLenght = 0;
    let alreadyListed = 0;
    let insufficientTokens;

    if ((!walletAddress, !propertyId, !tokensQuantity, !tokenPrice)) {
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
      if (walletAddress === item.ownerAddress) {
        matchedLenght += 1;

        if (Number(tokensQuantity) > Number(item.tokenHolder)) {
          insufficientTokens = true;
        }
        item.currentListedTokens = tokensQuantity;
        item.perTokenPrice = tokenPrice;
      }
    });

    if (matchedLenght === 0) {
      return res.status(404).json({
        status: false,
        message: "You are not the owner of this property!",
      });
    }

    if (insufficientTokens) {
      return res
        .status(403)
        .json({ status: false, message: "You have insufficient Tokens!" });
    }

    property.listedBy.forEach((item) => {
      if (item === walletAddress) {
        alreadyListed = 1;
      }
    });

    if (alreadyListed !== 1) {
      property.listedBy.push(walletAddress);
    }

    property.isListed = true;

    const savedProperty = await property.save();
    if (savedProperty) {
      return res.status(200).json({ success: true, savedProperty });
    }
  } catch (error) {
    return res.json({ status: false, message: error.message });
    next(ex);
  }
};

module.exports.getAllPropertyAds = async (req, res, next) => {
  try {
    const property = await Property.find({
      // propertyStatus: "active",
      isListed: true,
    });
    if (!property) {
      return res
        .status(404)
        .json({ status: false, message: "no property found!" });
    }
    return res.json({ status: true, property });
  } catch (error) {
    return res.json({ status: false, message: error.message });
    next(ex);
  }
};

module.exports.checkToBuyPropertyToken = async (req, res, next) => {
  try {
    const { walletAddress, propertyId, ownerWalletAddress } = req.body;
    let matchedLenght1 = 0;
    let matchedLenght2 = 0;

    if ((!walletAddress, !propertyId, !ownerWalletAddress)) {
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

    property?.propertyOwner?.forEach((item) => {
      if (item.ownerAddress === ownerWalletAddress) {
        matchedLenght1 += 1;
      }
    });

    property.listedBy.forEach((item) => {
      if (ownerWalletAddress === item) {
        matchedLenght2 += 1;
      }
    });

    if (matchedLenght1 === 0) {
      return res.status(404).json({
        status: false,
        message: "Seller is not the owner of this property!",
      });
    }

    if (matchedLenght2 === 0) {
      return res.status(404).json({
        status: false,
        message: "Property not currently listed for sale",
      });
    }

    return res.json({ status: true });
  } catch (error) {
    return res.json({ status: false, message: error.message });
    next(ex);
  }
};

module.exports.buyPropertyToken = async (req, res, next) => {
  try {
    const {
      walletAddress,
      propertyId,
      ownerWalletAddress,
      currentListedTokens,
      perTokenPrice,
    } = req.body;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        status: false,
        message: "Property with this id is not found!",
      });
    }

    let addOwner = {
      ownerAddress: walletAddress,
      tokenHolder: currentListedTokens,
      perTokenPrice: perTokenPrice,
      currentListedTokens: "0",
    };

    let postionOfNewOwner = property.propertyOwner.findIndex(
      (owner) => owner.ownerAddress === walletAddress
    );

    if (postionOfNewOwner !== -1) {
      // Parse existing tokenHolder and currentListedTokens to numbers
      let existingTokenHolder = parseInt(
        property.propertyOwner[postionOfNewOwner].tokenHolder
      );
      let existingCurrentListedTokens = parseInt(
        property.propertyOwner[postionOfNewOwner].currentListedTokens
      );

      // Update tokenHolder and currentListedTokens
      property.propertyOwner[postionOfNewOwner].tokenHolder = (
        existingTokenHolder + parseInt(currentListedTokens)
      ).toString();
      property.propertyOwner[postionOfNewOwner].currentListedTokens = (
        existingCurrentListedTokens + parseInt(currentListedTokens)
      ).toString();

      property.propertyOwner[postionOfNewOwner].perTokenPrice = perTokenPrice;
    } else {
      property.propertyOwner.push(addOwner);
    }

    // Find the positionOfOwner of the owner based on ownerWalletAddress
    let positionOfOwner = property.propertyOwner.findIndex(
      (owner) => owner.ownerAddress === ownerWalletAddress
    );

    if (positionOfOwner !== -1) {
      // Update currentListedTokens to "0" for the specified owner
      property.propertyOwner[positionOfOwner].currentListedTokens = "0";
      // Subtract currentListedTokens from tokenHolder
      let holder = (property.propertyOwner[positionOfOwner].tokenHolder -=
        parseInt(currentListedTokens));

      // Use filter to remove the owner if currentListedTokens is "0"
      property.propertyOwner = property.propertyOwner.filter(
        (owner) => owner.tokenHolder !== "0"
      );

      property.listedBy = property.listedBy.filter(
        (address) => address !== ownerWalletAddress
      );
    }

    // console.log({ property });
    // return res.json({ property });

    const savedProperty = await property.save();
    if (!savedProperty) {
      res.status(500).json({ status: false, message: "Error Occurred!" });
    } else {
      return res.status(200).json({
        status: true,
        message: "You now have token ownership of this property!",
      });
    }
  } catch (error) {
    return res.json({ status: false, message: error.message });
    next(ex);
  }
};
