const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken")


module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password, phoneNumber, cnic } = req.body;
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
            cnic
        });
        delete user.password;
        return res.json({ status: true, user });

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
            return res.json({ message: "Incorrect email or password", status: false });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);


        if (!isPasswordValid) {
            return res.json({ message: "Incorrect email or password", status: false });
        }

        if (user.status !== "active") {
            return res.json({ message: "Your profile is not verified by admin", status: false });
        }

        delete user.password;
        return res.json({ status: true, user, token: `Bearer ${generateToken(user._id.toString())}` });

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
        return res.json({ status: false, error: ex.message });
        next(ex);
    }
};



module.exports.getAllPendingUsers = async (req, res, next) => {
    try {
        const users = await User.find({status: "pending"});
        return res.json({ status: true, users });

    } catch (ex) {
        return res.json({ status: false, error: ex.message });
        next(ex);
    }
};








