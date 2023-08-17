const express = require("express"); //server
const cors = require("cors"); //errors
const mongoose = require("mongoose"); //database
const app = express();
const cloudinary = require("cloudinary"); //image

require("dotenv").config();

app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(express.json());

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const userRoute = require("./routers/userRoutes");
const propertyRoute = require("./routers/propertyRoutes");

app.use("/api/user", userRoute);
app.use("/api/property", propertyRoute);

//database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

//server listeining on port 5000
const server = app.listen(5000, () => console.log(`Server started on 5000`));
