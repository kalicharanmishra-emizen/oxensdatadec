const mongoose = require("mongoose");

const Schema = mongoose.Schema({
    reason:String,
    description:{type:String,default:''}
},{timestamps:true})
module.exports= mongoose.model('DriverSupportRequest',Schema)
