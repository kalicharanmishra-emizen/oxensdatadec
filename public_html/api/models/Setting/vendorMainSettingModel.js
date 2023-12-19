const mongoose = require("mongoose");
const Schema = mongoose.Schema({
    storeId:{type:mongoose.Schema.Types.ObjectId,default:null},
    fixLimitDeliveryDistance:{type:Number,default:0},
    deliveryDistance:{type:Number,default:0},
    minDeliveryCharge:{type:Number,default:0},
    deliveryExtraFeeUnit:{type:Number,default:0},
    deliveryExtraFee:{type:Number,default:0},
})
module.exports = mongoose.model('VendorMainSetting',Schema)