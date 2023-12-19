const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const driverLocationSchema = mongoose.Schema({
    lat:{
        type:Number,
        default:0
    },
    lng:{
        type:Number,
        default:0
    }
})
const Schema = mongoose.Schema({
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    preJobId:{
        type:mongoose.Schema.Types.ObjectId,
        default:null
    },
    driverId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    storeId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    accpetLocation:{
        type:driverLocationSchema,
        default:{
            lat:0,
            lng:0
        }
    },
    isFirst:{
        type:Boolean,
        default:false
    },
    status:{
        type:Number,
        enum:[0,1,2,3,4],
        default:0
    }
    /*status  0=>Pending / 1=>Accpet / 2=>Reject / 3=> onProccess / 4=> Complete */
},{timestamps:true})
Schema.plugin(aggregatePaginate)
module.exports = mongoose.model('DriverJob',Schema)