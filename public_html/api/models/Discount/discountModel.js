const mongoose = require("mongoose");
const Schema = mongoose.Schema({
    storeId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    discountType:{
        type:Number,
        enum:[0,1],
        default:0
    },
    discountValue:{
        type:Number,
        default:0,
    },
    maxDiscount:{
        type:Number,
        default:0,
    }
    
},{timestamps:true})
/* 
* discountType:- 0-> Percentage  1-> fixed
*/
module.exports = mongoose.model('discount',Schema)