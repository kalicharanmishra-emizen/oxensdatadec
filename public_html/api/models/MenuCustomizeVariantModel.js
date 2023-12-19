const mongoose = require('mongoose');
const dependentPrice = mongoose.Schema({
    varientId:{type:mongoose.Schema.Types.ObjectId},
    title:{type:String},
    price:{type:String,default:"0.00"}
})
const Schema = mongoose.Schema({
    customizeId:{type:mongoose.Schema.Types.ObjectId},
    title:{type:String,required:true},
    price:{type:String,default:"0.00"},
    isDefault:{type:Boolean,default:false},
    dependent_price:[
        {
            type:dependentPrice,
            default:null
        }
    ]
})
module.exports = mongoose.model('MenuCustomizeVariant',Schema)