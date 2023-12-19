const mongoose = require("mongoose");
const Schema = mongoose.Schema({
    driverWaitTime:{type:Number,default:0},
    serviceFee:{type:Number,default:0},
    maxServiceFee:{type:Number,default:0},
    vatCharge:{type:Number,default:0},
    deliveryDistance:{type:Number,default:0},
    fixLimitDeliveryDistance:{type:Number,default:0},
    minDeliveryCharge:{type:Number,default:0},
    deliveryExtraFeeUnit:{type:Number,default:0},
    deliveryExtraFee:{type:Number,default:0},
    fixDriverDistance:{type:Number,default:0},
    minDriverPayFirst:{type:Number,default:0},
    extraDriverPaySecond:{type:Number,default:0},
    deliveryExtraPayUnit:{type:Number,default:0},
    deliveryExtraPay:{type:Number,default:0},
    taxPay:{type:Number,default:0},
    deliveryDis:{type:Number,default:0}
})
module.exports = mongoose.model('MainSetting',Schema)