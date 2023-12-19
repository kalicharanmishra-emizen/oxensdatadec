const Mongoose = require("mongoose");
const Schema = Mongoose.Schema({
    vehicleType:String,
    maxDistance:Number,
    packageLimit:[String],
},{timestamps:true})
module.exports = Mongoose.model('OrderAssignSetting',Schema)