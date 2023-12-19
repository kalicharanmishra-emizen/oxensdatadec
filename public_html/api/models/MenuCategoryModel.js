const Mongoose = require("mongoose");

const Schema = Mongoose.Schema({
    title:String,
    vendorId:{type:Mongoose.Schema.Types.ObjectId},
    status:{type:Boolean,default:true}
},{timestamps:true})


module.exports = Mongoose.model('MenuCategory',Schema);