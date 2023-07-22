const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,    
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: "user"
    },
    status: {
        type: String,
        default: "pending"
    },
    cnic: {
        type: Number,
        required: true,
        unique: true

    },
    cnicFront:{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    cnicBack:{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },

})


module.exports = mongoose.model("Users", userSchema)