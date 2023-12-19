const { model, Schema } = require("mongoose");
const logSchema = Schema({
    orderId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    message:{
      type:String,
      default:''  
    },
    logTime:{
        type:Date,
        default:new Date()
    }
})
module.exports = model('OrderLogs',logSchema)