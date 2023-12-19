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
const vendorSchema = mongoose.Schema(
    {
        typeOf:{type:mongoose.Schema.Types.ObjectId},
        category:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category'
        }],
        location:{
            address:{type:String,default:null},
            late:{type:String,default:null},
            lng:{type:String,default:null},
            location:{
                type:geoSchema,
                index: '2dsphere',
                default: {
                    coordinates : [0,0]
                }
            },
        },
        commission:{type:Number,default:0},
        preparation_time:{type:String,default:0},
        minimum_amount:{type:Number,default:0},
        contactPerson:{
            name:{type:String,default:null},
            email:{type:String,default:null},
            phone_no:{type:String,default:null}
        },
        hygiene_url:{type:String,default:null},
        deliveryType:{
            type:Number,
            enum:[0,1],
            default:0
        },
        assignPOS:{
            type:Number,
            enum:[0,1],
            default:0
        }
    }
)
const userSchema = mongoose.Schema(
    {
        dob:{type:String,default:null},
    }
)
const driverSchema = mongoose.Schema(
    {
        online:{type:Boolean,default:false},
        phoneVarified:{type:Boolean,default:false},
        emailVarified:{type:Boolean,default:false},
        dob:{type:String,default:null},
        country:{type:String,default:null},
        county:{type:String,default:null},
        city:{type:String,default:null},
        postcode:{type:String,default:null},
        address:{type:String,default:null},
        vehicleType:{type:Number,enum:[1,2,3]},
        rating:{type:Number,default:5},
        notification:{
            token:{ type:String, default:null },
            status:{ type:Boolean, default:true },
            type:{ type:String, enum:['iPhone','Andorid','Null'], default:'Null' },
        },
        income:{
            total:{type:Number,default:0},
            paid:{type:Number,default:0},
        },
        currentLocation:{
            type:geoSchema,
            index: '2dsphere',
            default: {
                coordinates : [0,0]
            }
        }
    }
)
/* vehicleType  1 => Cycle ,2=>Bike ,3=> Car  */
const Schema= mongoose.Schema({
    name:{type:String,default:null},
    email:{type:String,required:true},
    password:{type:String,default:null},
    pro_image:{type:String,default:null},
    phone_no:{type:String,required:true},
    status:{type:Boolean,default:1},
    stripeCusId:{type:String,default:null},
    role:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Roles'
    }],
    vendor_profile:{
        type:vendorSchema,
        default:{}
    },
    user_profile:{
        type:userSchema,
        default:{}
    },
    driver_profile:{
        type:driverSchema,
        default:{}
    },
    contact_id:{type:String}
},{timestamps:true});
Schema.plugin(aggregatePaginate)
/* .path is use for get every coloum in collection and .get function is uer for set that colum value at a time of get*/
Schema.path('pro_image').get(function (value) {
    if(value){
        return process.env.PUBLIC_FOLDER_URL+''+value; 
    }else{
        return process.env.PUBLIC_FOLDER_URL+'user.jpg';
    }
});
// deliveryType =>> 0 = oxens, 1 => Self 
// assignPOS ==>  0 = not assigned, 1 = assigned POS
// Schema.pre('deleteOne', function(next) {
//     UserDetail.deleteOne({user: this._conditions._id}).exec();
//     next();
// });
module.exports=mongoose.model('Users',Schema)