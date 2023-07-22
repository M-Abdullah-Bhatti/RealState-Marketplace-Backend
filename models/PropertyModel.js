const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   plotType:{
    type: String,
    required: true,

   },

   price:{
    type: Number,
    required: true,

   },

   location:{
    type: String,
    required: true,

   },

   area:{
    type: String,
    required: true,

   },

   rooms:{
    type: String,
    
   },

   description:{
    type:String,
    required:true,

   },

   purpose:{
    type: String,
    required: true,

   },

   propertyImage:{
    type: String,

   },

   city:{
    type: String,
    required:true,

   },

   propertyStatus:{
    type:String,
    required: true,

   },

})


module.exports = mongoose.model("Property", propertySchema)