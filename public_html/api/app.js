const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload')
const shedular = require('./shedular/shedul-crons');
//requiring the validator
const adminRoute = require('./routes/adminRoute');
const vendorRoute = require('./routes/vendorRoute');
const userRoute = require("./routes/userRoute")
const driverRoute = require("./routes/driverRoute")
/* connect to database start */
mongoose.set('strictQuery', false);

mongoose.connect(`mongodb://oxens:MusedElicitCopierEgrets@localhost:27017/oxens`,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then((e) => console.log("db connected")).catch(e => console.log("db error", e.message));
/* connect to database end */
const cors = require('cors')
/* define middlewares START */

app.use(cors())
// define felper file
global.validate_helper=require('./modules/validate-helper');
global.helper=require('./helper');
global.__basedir = __dirname;
app.use('/public',express.static('public'));
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// for parsing multipart/form-data
app.use(fileUpload({
    createParentPath: true,
}));
// define Routes
app.use('/admin',adminRoute);
app.use('/vendor',vendorRoute);
app.use("/user",userRoute)
app.use("/driver",driverRoute)

shedular.updateOrders()
shedular.assignDriver()

// last roue for 404 page
app.use((req,res,next)=>{
    const error = new Error('Not Found data');
    error.status=404;
    next(error);
});
 // handel error unexpated error 
app.use((error,req,res,next)=>{

    responseData={
        data:{
            statusCode:error.status || 500,
            message:error.message,
        },
        code:error.status || 500
    }
    return errorResponse(req,res,responseData)
});
/* define middlewares END */
module.exports =app;
