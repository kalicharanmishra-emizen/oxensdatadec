const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    itemId:{type:mongoose.Schema.Types.ObjectId},
    title:{type:String,required:true},
    is_multiple:{type:Boolean,default:false},
    max_multiple:{type:String,default:null},
    is_dependent:{type:Boolean,default:false},
    dependent_with:{type:mongoose.Schema.Types.ObjectId,default:null},
    status:{type:Boolean,default:true},
})


module.exports = mongoose.model('MenuItemCustomize',Schema)