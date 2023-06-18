const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();


require("dotenv").config();

app.use(cors());
app.use(express.json());

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



