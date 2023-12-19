const mongoose = require("mongoose");
const geoSchema = mongoose.Schema({
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number]
    }
});
const Schema = mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId},
    tag:String,
    address:String,
    area:{type:String,default:null},
    lat:{type:String,default:null},
    lng:{type:String,default:null},
    location:{
        type:geoSchema,
        index: '2dsphere',
        default: {
            coordinates : [0,0]
        }
    },
},{timestamps:true})
module.exports = mongoose.model('Address',Schema)