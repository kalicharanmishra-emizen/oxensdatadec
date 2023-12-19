const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    driverIds:[{
        type:mongoose.Schema.Types.ObjectId,
    }],
    try:{type:Number,default:0},
    time:{type: Date,default:null},
    status:{type:Boolean,default:true}
},{timestamps:true})
module.exports = mongoose.model('AssigingDriver',Schema)