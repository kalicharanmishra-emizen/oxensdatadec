const mongoose = require("mongoose");

const Schema = mongoose.Schema({
    storeName:String,
    storeType:String,
    cPersonName:String,
    cPersonEmail:String,
    cPersonPhoneNo:String,
    storeLocation:String,
},{timestamps:true})
module.exports = mongoose.model('BecomeStore',Schema)