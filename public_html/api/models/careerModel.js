const mongoose = require("mongoose");

const Schema = mongoose.Schema({
    name:String,
    phone_no:String,
    email:String,
    position:String,
    curProfile:String,
    totelExp:String,
    relExp:String,
    coverLetter:String,
    resume:String,
},{timestamps:true})
module.exports = mongoose.model('Career',Schema)