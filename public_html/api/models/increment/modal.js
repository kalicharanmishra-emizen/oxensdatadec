const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    collectionName:String,
    incrementValue:{type:Number,default:0}
})
module.exports = mongoose.model('Increment',Schema)