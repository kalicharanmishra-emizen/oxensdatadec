const mongoose = require("mongoose");

const Schema = mongoose.Schema({
    reason:String,
    description:{type:String,default:''},
    orderId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'orders'
    }]
},{timestamps:true})
module.exports= mongoose.model('orderRejectRequest',Schema)
