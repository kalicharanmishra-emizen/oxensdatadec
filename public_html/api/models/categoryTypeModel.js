const mongoose = require("mongoose");

const Schema = mongoose.Schema({
    title:{type:String,required:true},
    status:{type:Boolean,default:true}
},{timestamps:true})
module.exports = mongoose.model('CategoryType',Schema)
