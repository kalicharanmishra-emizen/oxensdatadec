const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema({
    driverId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    storeId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    earning:{
        type:Number,
        required:true
    },
    tip:{
        type:Number,
        default:0
    }
},{timestamps:true})
Schema.plugin(aggregatePaginate)
module.exports = mongoose.model("DriverIncome",Schema)
