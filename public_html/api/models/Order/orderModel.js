const { application } = require('express');
const mongoose = require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const geoSchema = mongoose.Schema({
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number]
    }
});
const AddressSchema = mongoose.Schema({
    address:{type:String,default:null},
    tag:{type:String,default:'Other'},
    lat:{type:String,default:'0'},
    lng:{type:String,default:'0'},
    location:{
        type:geoSchema,
        index: '2dsphere',
        default: {
            coordinates : [0,0]
        }
    }
})
const DiscountSchema = mongoose.Schema({})
const Schema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    storeId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    deliveryAddress:{
        type:AddressSchema,
        required:true
    },
    pickupData:{
        date:{
            type:String,
            default:''
        },
        time:{
            type:String,
            default:''
        }
    },
    discount:{
        type:DiscountSchema,
        default:{}
    },
    type:{
        type:Number,
        enum:[0,1],
        default:0
    },
    orderNumber:{type:Number,required:true},
    totalQuantity:{type:String,required:true},
    totalMrp:{type:String,required:true},
    discountPrice:{type:String,default:'0.00'},
    orderFee:{type:String,default:'0.00'},
    deliveryPrice:{type:String,default:'0.00'},
    servicePrice:{type:String,default:'0.00'},
    taxCharge:{type:String,default:'0.00'},
    totalPrice:{type:String,required:true},
    tip:{type:String,default:'0.00'},
    comment:{type:String,default:null},
    driverAssignStatus:{type:Boolean,default:false},
    driverAssign:{
        type:mongoose.Schema.Types.ObjectId,
        default:null
    },
    vendorCode:String,
    userCode:String,
    status:{type:Number,enum:[0,1,2,3,4,5,6,7,8],default:0},
    packageType:{type:Number,enum:[0,1,2,3],default:0},

    paymentStatus:{type:Number,enum:[0,1,2,3],default:0},
    transectionId:{type:String,default:null},
    userPDF:{type:String,default:null},
    driverPDF:{type:String,default:null},
    venderPDF:{type:String,default:null},
    collectionPDF:{type:String,default:null},

    orderType:{type:Number,enum:[0,1],default:0},
    paymentMode:{type:Number,enum:[0,1,2],default:0},
    transectionIdPOS:{type:String,default:null},
    callMaskingSid:{type:String},
    twillioPhoneNumber:{type:String},
    callStatus:{type:Boolean,default:false},

    /* packageType  0=> Pending or Not assign / 1=>Small / 2=> Medium / 3=> Large */ 
    /*status  0=>Pending / 1=>Accpet / 2=>Ready to pickup / 3=> picked / 4=> On the Way / 5=> Arrived / 6=> Delivered / 7 =>refund  / 8 = cancel */ 
    // type 0=> Delivery 1=> Pickup
    // paymentStatus 0 => processing, 1 => succeeded, 2 => payment_failed  3 => canceled
    // orderType  0 => online, 1 => POS 
    // paymentMode  0 => Cash, 1 => wallet,  2 => Card  
},{timestamps:true})

Schema.plugin(aggregatePaginate)
module.exports = mongoose.model('Order',Schema)
