const mongoose = require('mongoose');
const productCustomize = mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    title:String,
    variants:[
        {
            id:mongoose.Schema.Types.ObjectId,
            title:String
        }
    ]
})
const Schema = mongoose.Schema({
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    age_res:{
        type:Boolean,
        default:false
    },
    title:String,
    customize:[{
        type:productCustomize,
        default:null
    }],
    quantity:Number,
    price:Number,
},{timestamps:true})
module.exports = mongoose.model('OrderProduct',Schema)