const mongoose = require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema({
    category:{type:mongoose.Schema.Types.ObjectId,required:true},
    vendorId:{type:mongoose.Schema.Types.ObjectId,required:true},
    age_res:{type:Boolean,default:false},
    item_img:{type:String,default:null},
    title:{type:String,required:true},
    description:{type:String,default:null},
    is_customize:{type:Boolean,default:false},
    price:{type:String,default:"0.00"},
    status:{type:Boolean,default:false},
    badge:{
        type:Number, 
        enum:[0,1,2,3,4,5],
        default:0
    },
    aprovedByAdmin:{type:Boolean,default:false},
    item_id:{type:String}
}); 
// badge => 0 = defoult, 1 = New Arrival , 2 = Bestseller , 3 = Featured, 4 = Popular, 5 = Trending 
Schema.plugin(aggregatePaginate)
Schema.post('findOne',(doc,next) => {
        if (doc.item_img) {
            doc.item_img = process.env.PUBLIC_FOLDER_URL+''+doc.item_img;
        }else{
            doc.item_img = process.env.PUBLIC_FOLDER_URL+'img01.jpg';   
        }  
    next();
})
module.exports = mongoose.model('MenuItem',Schema)