const Property = require("../models/PropertyModel");
const cloudinary = require("cloudinary");

module.exports.registerProperty = async (req, res, next) => {
  try {
    if (!req.body.walletAddress) {
      return res
        .status(400)
        .json({ status: false, message: "wallet address is not given" });
    }

    // Storing Property Images In cloudinary
    let propertyImages = []

    if (typeof req.body.propertyImages === 'string') {
        propertyImages.push(req.body.propertyImages)
    } else {
        propertyImages = req.body.propertyImages
    }

    const propertyImagesLinks = []

    for (let i = 0; i < propertyImages.length; i++) {
        const result = await cloudinary.v2.uploader.upload(propertyImages[i], {
            folder: 'propertyImages',
        })

        propertyImagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        })
    }

    req.body.propertyImages = propertyImagesLinks


     // Storing Property Document Images In cloudinary
    let propertyDocuments = []

    if (typeof req.body.propertyDocuments === 'string') {
        propertyDocuments.push(req.body.propertyDocuments)
    } else {
        propertyDocuments = req.body.propertyDocuments
    }

    const propertyDocumentsLinks = []

    for (let i = 0; i < propertyDocuments.length; i++) {
        const result = await cloudinary.v2.uploader.upload(propertyDocuments[i], {
            folder: 'propertyDocuments',
        })

        propertyDocumentsLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        })
    }

    req.body.propertyDocuments = propertyDocumentsLinks

    // ==================================================

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
    console.log(property.length);
    if (property.length === 0) {
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

module.exports.getAllRentListing = async (req, res, next) => {
  try {
    const property = await Property.find({
      purpose: "Rent",
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

module.exports.rentAllPropertyOwners = async (req, res, next) => {
  try {
    const { propertyId } = req.body;
    if (!propertyId) {
      return res
        .status(404)
        .json({ status: false, message: "No property id is provided!" });
    }
    const property = await Property.findById(propertyId);
    const owners = [];
    const amounts = [];
    const rentPrice = parseFloat(property.rentPrice); // Assuming rentPrice is in Ether

    property.propertyOwner.forEach((owner) => {
      owners.push(owner.ownerAddress);
      const amount =
        (parseFloat(owner.tokenHolder) / property.totalTokens) * rentPrice;
      console.log(amount * 10 ** 18);
      amounts.push((amount * 10 ** 18).toString()); // Convert to Wei
    });

    // Send the prepared data as response
    return res.json({ status: true, owners, amounts });
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
    property.isListed = false;
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
