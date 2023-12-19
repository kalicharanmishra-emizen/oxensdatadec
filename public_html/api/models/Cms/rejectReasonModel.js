const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    title:String,
    status:{type:Boolean,default:true}
},{timestamps:true})
module.exports= mongoose.model('OrderRejectReason',Schema)