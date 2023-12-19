const mongoose = require("mongoose");
const Schema = mongoose.Schema({
    storeId:{
        type:mongoose.Schema.Types.ObjectId,
        default:null
    },
    firstName:{
        type:String,
        default:null
    },
    lastName:{
        type:String,
        default:null
    },
    email:{
        type:String,
        default:null
    },
    phoneNo:{
        type:String,
        default:null
    }
}, { timestamps:true })
module.exports = mongoose.model("POSuser", Schema)