const mongoose = require("mongoose");
const Schema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    title : { type:String,default:null },
    body : { type:String,default:null },
    status : { type:Boolean,default:true }
},{ timestamps:true })
module.exports = mongoose.model('Notification',Schema)