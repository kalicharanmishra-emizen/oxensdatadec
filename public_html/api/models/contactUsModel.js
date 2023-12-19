const mongoose = require("mongoose");

const Schema = mongoose.Schema({
    fname:String,
    lname:String,
    email:String,
    phoneNo:String,
    message:String
},{timestamps:true})
module.exports = mongoose.model('ContactUs',Schema)