const mongoose = require("mongoose");
const Schema = mongoose.Schema({
    driverId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    type:{
        type:Number,
        enum:[0,1],
    },
    token:{
        type:String,
        default:""
    },
    status:{
        type:Boolean,
        default:false
    }
    /*type  0=>Email / 1=>Phone */
},{timestamps:true})
module.exports = mongoose.model('driverVarification',Schema)