const mongoose = require("mongoose");

const Schema = mongoose.Schema({
    title:{type:String,required:true},
    type:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CategoryType',
        required:true
    },
    status:{type:Boolean,default:true}
},{timestamps:true})
module.exports = mongoose.model('Category',Schema)