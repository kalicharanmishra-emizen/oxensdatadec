const mongoose = require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        default:null
    },
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        default:null
    },
    driverId:{
        type:mongoose.Schema.Types.ObjectId,
        default:null
    },
    storeId:{
        type:mongoose.Schema.Types.ObjectId,
        default:null
    },
    type:{
        type:String,
        enum:["order","driver"],
        default:""
    },
    rateType:{
        type:Number,
        enum:[1,2,3,4,5],
        default:1
    },
    description:{
        type:String,
        default:""
    }
},{timestamps:true})
Schema.plugin(aggregatePaginate)

// rateType 1 => Terrible, 2 => Bad, 3 => Meh, 4 => Good, 5 => Awesome

module.exports = mongoose.model('ReviewRating',Schema)