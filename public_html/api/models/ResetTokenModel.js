const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    token:{
        type:String,
        required:true
    }
},{timestamps:true})
module.exports = mongoose.model('ResetToken',Schema)