const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken")
const cloudinary = require("cloudinary");




module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password, phoneNumber, cnic, cnicFront, cnicBack } = req.body;

      

        const cnic1 = await cloudinary.v2.uploader.upload(cnicFront, {
            folder: "cnic",
            width: 150,
            crop: "scale",
        });


        const cnic2 = await cloudinary.v2.uploader.upload(cnicBack, {
            folder: "cnic",
            width: 150,
            crop: "scale",
        });


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
            cnic,
            cnicFront: {
                public_id: cnic1.public_id,
                url: cnic1.secure_url,
            },
            cnicBack: {
                public_id: cnic2.public_id,
                url: cnic2.secure_url,
            },
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
            return res.json({ message: "Incorrect email or password", status: false });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);


        if (!isPasswordValid) {
            return res.json({ message: "Incorrect email or password", status: false });
        }

        if (user.status !== "active") {
            return res.json({ message: "Your profile is not verified by admin", status: false });
        }


        const userObject = user.toObject();
        delete userObject.password;


        return res.json({ status: true, user: userObject, token: `Bearer ${generateToken(user._id.toString())}` });

    } catch (ex) {
        return res.json({ status: false, error: ex.message });
        next(ex);
    }
};


module.exports.updateUserStatus = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "User not found", status: false });
        }

        const updatedUser = await User.findOneAndUpdate(
            { email: req.body.email }, req.body, { new: true });

        const userObject = updatedUser.toObject();
        delete userObject.password;
        return res.json({ status: true, user: userObject });

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
        const users = await User.find({ status: "pending" });
        return res.json({ status: true, users });

    } catch (ex) {
        return res.json({ status: false, error: ex.message });
        next(ex);
    }
};








