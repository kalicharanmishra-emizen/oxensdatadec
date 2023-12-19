const { validationResult } = require("express-validator");
const nodemailer = require('nodemailer');
const mongoose = require("mongoose");
const path = require('path');
const Increment = require('./models/increment/modal');
const DriverJob = require('./models/Driver/jobModel');
const OrderLog = require('./models/Order/logsModel');
const axios = require('axios');

successResponse=(req,res,value)=>{
    return  res.status(value.code).json({
                statusCode:value.data.statusCode,
                message:value.data.message,
                data:value.data.data,
            });
}

testResponse=(req,res,value)=>{
    res.status(200).json({
        data:value
    });
}

errorResponse=(req,res,value)=>{
    return  res.status(value.code).json({
                statusCode:value.data.statusCode,
                message:value.data.message
            });
}

generateRendomCode = () =>{
    // return Math.floor(1000 + Math.random() * 9000)
    return 1111
}

// validation response
commonValidate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let response={
            data:{
                statusCode:401,
                message:errors.array()[0].msg
            },
            code:401
        };
        return errorResponse(req, res,response)
    }
    return next();
}

sendEmail = async (mailData) => {
    try {
        let transport = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: process.env.MAIL_SECURE, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USERNAME, // generated ethereal user
                pass: process.env.MAIL_PASSWORD, // generated ethereal password
            },
        })
        let info = await transport.sendMail({
            from: `${process.env.MAIL_FROM_NAME} < ${process.env.MAIL_FROM} >`,
            to:mailData.to,
            subject:mailData.subject,
            html:mailData.temp
        })  
        return info;
    } catch (e) {
        return false;
    }
}

fileUpload = async (file,location='') =>{
    let filename= path.join(location+new Date().toISOString().replace(/:/g, '-')+path.extname(file.name));
    let uploadPath=path.join(process.cwd(),'./public/'+filename);
    await file.mv(uploadPath);
    // ,(err)=>{if(err){responseData={data:{statusCode:500,message:'img not upload',},code:500}return errorResponse(req,res,responseData)}}
    return filename;
}

fileUrlRemove = async (url) =>{
    return url.replace(process.env.PUBLIC_FOLDER_URL,'');
}

convortToObjID = async (data) =>{
   return  mongoose.Types.ObjectId(data)
}

getAutoIncrementValue = async (collectionName) => {
    let result = await Increment.findOneAndUpdate({collectionName:collectionName},{$inc:{'incrementValue':1}},{new:true})
    return result.incrementValue
}

calculateGeoDiatance = async (data) =>{
    try {
        let res = await axios({
            method:'get',
            url:`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${data.origin}&destinations=${data.des}&key=${process.env.MAP_API}`
        })
        if (res.data.status==='OK') {
            let returnData = 0;
            res.data.rows[0]['elements'].forEach(element=>{
                if(element.status==='OK'){
                    returnData =  Number((element.distance.value/1609).toFixed(2))
                }
            })
            return returnData
        }else{
            return 0
        }
    } catch (error) {
        console.log('Distance Matrix error',error);
        return 0
    }
}

getDriverPrvJobData = async (preJobId) =>{
    let preJob = await DriverJob.aggregate([
        {
            $match:{
                _id:preJobId
            }
        },
        {
            $lookup:{
                from:"users",
                let:{storeID:"$storeId"},
                pipeline:[
                    {
                        $match:{
                            $expr:{
                                $eq:['$_id',"$$storeID"]
                            }
                        }
                    },
                    {
                        $project:{
                            _id:0,
                            lat:"$vendor_profile.location.late",
                            lng:"$vendor_profile.location.lng"
                        }
                    }
                ],
                as:"storeData"
            }
        },
        {
            $lookup:{
                from:"orders",
                let:{orderID:"$orderId"},
                pipeline:[
                    {
                        $match:{
                            $expr:{
                                $eq:['$_id',"$$orderID"]
                            }
                        }
                    },
                    {
                        $project:{
                            _id:0,
                            "deliveryAddress.lat":"$deliveryAddress.lat",
                            "deliveryAddress.lng":"$deliveryAddress.lng",
                        }
                    }
                ],
                as:"orderData"
            }
        },
        {
            $project:{
                preJobId:1,
                accpetLocation:1,
                isFirst:1,
                status:1,
                storeLocation:{$first:"$storeData"},
                orderData:{$first:"$orderData"}
            }
        }
    ])
    return preJob[0]||{}
}

sendPushNotification = async (notificationData) =>{
        let sendData = {
            registration_ids : [notificationData.token],
            priority : "high",  
            type : "default",  
            data : notificationData.notification
        }
        if (notificationData.type==='iPhone') {
            sendData['notification']= notificationData.notification
        }
        var config = {
            method: 'post',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: { 
                'Authorization': `key=${process.env.FIREBASE_SERVER_KEY}`, 
                'Content-Type': 'application/json'
            },
            data : JSON.stringify(sendData)
        };
        axios(config)
        .then(response=>{
            console.log('firebaseResponse',response.data);
        })
        .catch(error=>{
            console.log('firebaseError',error);
        })
}

createOrderLogs = async (orderId,message) => {
    new OrderLog({
        orderId:orderId,
        message:message
    }).save()
}
module.exports = {successResponse, testResponse, errorResponse, commonValidate, sendEmail,fileUrlRemove, fileUpload, convortToObjID, getAutoIncrementValue, calculateGeoDiatance, getDriverPrvJobData, sendPushNotification, createOrderLogs}