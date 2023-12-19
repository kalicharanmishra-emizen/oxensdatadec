const Mongoose = require("mongoose");

const Schema = Mongoose.Schema({
    img_type:String,
    vendorId:{type:Mongoose.Schema.Types.ObjectId},
    image:{type:String,default:null}
},{timestamps:true})
module.exports = Mongoose.model('VendorImage',Schema)

Schema.path('image').get(function (value) {
    if(value){
        return process.env.PUBLIC_FOLDER_URL+''+value; 
    }else{
        return process.env.PUBLIC_FOLDER_URL+'img01.jpg';
    }
});
