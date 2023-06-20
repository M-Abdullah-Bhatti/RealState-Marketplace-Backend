const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const cloudinary = require("cloudinary");


require("dotenv").config();

app.use(cors());
app.use(express.json());

// Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const userRoute = require("./routers/userRoutes")
app.use("/api/user", userRoute);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB Connetion Successfull");
})
    .catch((err) => {
        console.log(err.message);
    });


const server = app.listen(5000, () =>
    console.log(`Server started on 5000`)
);



