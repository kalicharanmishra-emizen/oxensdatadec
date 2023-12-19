const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    title:String,
    slug:String,
    content:String
},{timestamps:true})
module.exports= mongoose.model('Cms',Schema)