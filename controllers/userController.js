const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const cloudinary = require("cloudinary");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password, phoneNumber } = req.body;

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ message: "Email already used", status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      phoneNumber,
    });

    const userObject = user.toObject();
    delete userObject.password;
    return res.json({ status: true, user: userObject });
  } catch (ex) {
    return res.json({ status: false, error: ex.message });
    next(ex);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "Incorrect email or password",
        status: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({
        message: "Incorrect email or password",
        status: false,
      });
    }

    const userObject = user.toObject();
    delete userObject.password;

    return res.json({
      status: true,
      user: userObject,
      token: `Bearer ${generateToken(user._id.toString())}`,
    });
  } catch (ex) {
    return res.json({ status: false, error: ex.message });
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.json({ status: true, users });
  } catch (ex) {
    return res.status(400).json({ status: false, error: ex.message });
    next(ex);
  }
};

module.exports.getMyProfile = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, error: "No user found of this id" });
    }
    return res.json({ status: true, user });
  } catch (ex) {
    return res.json({ status: false, error: ex.message });
    next(ex);
  }
};
