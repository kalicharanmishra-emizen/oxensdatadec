const ejs = require('ejs');
const path = require('path');
const crypto = require("crypto");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Role = require('../../models/roleModel');
const User = require('../../models/usersModel');
const ResetToken = require('../../models/ResetTokenModel');
const DVar = require('../../models/Driver/varificationModel');
const { successResponse, errorResponse, testResponse } = require('../../helper');
const { otherEventHandler } = require('../../socket');
/* functions start */
const signUp= async (req,res,next)=>{
    let responseData={};
    try {
        let reqData=req.body;
        /* get role and asign to user */
        let roleId = await Role.findOne({name:"Driver"})
        const user = new User({
            name:reqData.name,
            email:reqData.email,
            password:bcrypt.hashSync(reqData.password,10),
            phone_no:reqData.phone_no,
            role:[roleId._id],
            driver_profile:{
                dob:reqData.dob,
                country:reqData.country,
                county:reqData.county,
                city:reqData.city,
                postcode:reqData.postcode,
                address:reqData.address,
                vehicleType:reqData.vehicleType
            }
        });
        let result =await user.save();
        
        let userData={
            _id:result._id,
            name:result.name,
            email:result.email,
            phone_no:result.phone_no,
            pro_image:result.pro_image,
            role:[roleId],
            driver_profile:result.driver_profile,
        }
        let token = jwt.sign(userData,process.env.SECRET_KEY_JWT,{expiresIn:"30d"})
        userData.token=token;
        delete 'role' in userData
        responseData={
            data:{
                statusCode:200,
                message:'success',
                data:userData
            },
            code:200
        }
        return successResponse(req,res,responseData)
    } catch (error) {
        console.log('error',error);
        responseData={
            data:{
                statusCode:500,
                message:'Something went wrong',
            },
            code:500
        }
        return errorResponse(req,res,responseData)
    }
}
const login= async(req,res,next)=>{
    let responseData={};
    try {
        let reqData=req.body;
        let result =await User.findOne({email:reqData.email}).populate('role');
        if (!result || result.role[0].name!=="Driver") {
            responseData={
                data:{
                    statusCode:401,
                    message:'Email or Password are incorrect',
                },
                code:419
            }
            return errorResponse(req,res,responseData)
        }
        let passwordStatus=await bcrypt.compare(reqData.password,result.password);
        if (!passwordStatus) {
            responseData={
                data:{
                    statusCode:401,
                    message:'Email or Password are incorrect',
                },
                code:419
            }
            return errorResponse(req,res,responseData)
        }
        let userData={
            _id:result._id,
            name:result.name,
            email:result.email,
            phone_no:result.phone_no,
            pro_image:result.pro_image,
            role:result.role,
            driver_profile:result.driver_profile
        }
        let token = jwt.sign(userData,process.env.SECRET_KEY_JWT,{expiresIn:"30d"})
        userData.token=token;
        delete 'role' in userData
        responseData={
            data:{
                statusCode:200,
                message:'success',
                data:userData
            },
            code:200
        }
        return successResponse(req,res,responseData)
    } catch (error) {
        console.log('exp',error);
        responseData={
            data:{
                statusCode:500,
                message:'Something went wrong',
            },
            code:500
        }
        return errorResponse(req,res,responseData)
    }
}
const profile=async(req,res,next)=>{
let responseData={};
    try {
        let reqData=req.user;
        let result =await User.findById({_id:reqData._id}).populate('role');
        let userData={
            _id:result._id,
            name:result.name,
            email:result.email,
            phone_no:result.phone_no,
            pro_image:result.pro_image,
            role:result.role,
            driver_profile:result.driver_profile
        }
        responseData={
            data:{
                statusCode:200,
                message:'success',
                data:userData
            },
            code:200
        }
        return successResponse(req,res,responseData)
    } catch (error) {
        console.log('exp',error);
        responseData={
            data:{
                statusCode:500,
                message:'Something went wrong',
            },
            code:500
        }
        return errorResponse(req,res,responseData)
    }
}
const update=async(req,res,next)=>{
    let responseData={}
    let authUser=req.user;
    try {
        let reqData=req.body
        let updateUserData={
            name:reqData.name,
            email:reqData.email,
            phone_no:reqData.phone_no,
            "driver_profile.dob":reqData.dob,
            "driver_profile.country":reqData.country,
            "driver_profile.county":reqData.county,
            "driver_profile.city":reqData.city,
            "driver_profile.postcode":reqData.postcode,
            "driver_profile.address":reqData.address,
        }
        let updateUser=await User.findByIdAndUpdate(authUser._id,{$set:updateUserData},{new:true}).populate('role');
        let userData={
            _id:updateUser._id,
            name:updateUser.name,
            email:updateUser.email,
            phone_no:updateUser.phone_no,
            pro_image:updateUser.pro_image,
            driver_profile:updateUser.driver_profile
        }
        responseData={
            data:{
                statusCode:201,
                message:"Profile update",
                data:userData
            },
            code:201
        }
        return successResponse(req,res,responseData);
    } catch (error) {
        responseData={
            data:{
                statusCode:500,
                message:'Something went wrong',
            },
            code:500
        }
        return errorResponse(req,res,responseData)
    }
    
} 
const updateProfileImage = async (req,res,next) => {
    let responseData={}
    let authUser=req.user;
    try {
        let updateUserData = {
            pro_image:await fileUpload(req.files.pro_image)
        }
        // console.log('updateUserData',updateUserData);
        let updateUser=await User.findByIdAndUpdate(authUser._id,{$set:updateUserData},{new:true}).populate('role');
        let userData={
            _id:updateUser._id,
            name:updateUser.name,
            email:updateUser.email,
            phone_no:updateUser.phone_no,
            pro_image:updateUser.pro_image,
            driver_profile:updateUser.driver_profile
        }
        responseData={
            data:{
                statusCode:201,
                message:"Profile update",
                data:userData
            },
            code:201
        }
        return successResponse(req,res,responseData);
    } catch (error) {
        responseData={
            data:{
                statusCode:500,
                message:'Something went wrong',
            },
            code:500
        }
        return errorResponse(req,res,responseData)
    }
}
const updatePass=async(req,res,next)=>{
    let responseData={}
    let authUser=req.user;
    try {
        let reqData = req.body;
        await User.findByIdAndUpdate(authUser._id,{password:bcrypt.hashSync(reqData.new_pass,10)});
        responseData={
            data:{
                statusCode:201,
                message:"Password updated successfull",
                data:{}
            },
            code:201
        }
        return successResponse(req,res,responseData);
    } catch (error) {
        responseData={
            data:{
                statusCode:500,
                message:'Something went wrong',
            },
            code:500
        }
        return errorResponse(req,res,responseData) 
    }
}
const onlineStatus = async (req,res,next) =>{
    let responseData = {}
    let authUser = req.user
    try {
        let reqData = req.body
        if (!('status' in reqData)) {
            responseData={
                data:{
                    statusCode:401,
                    message:'Status is required',
                },
                code:401
            }
            return errorResponse(req,res,responseData) 
        }
        await User.findByIdAndUpdate(authUser._id,{$set:{"driver_profile.online":reqData.status}})
        responseData={
            data:{
                statusCode:201,
                message:"Online status update",
                data:{}
            },
            code:201
        }
        return successResponse(req,res,responseData);
    } catch (error) {
        console.log('error',error);
        responseData={
            data:{
                statusCode:500,
                message:'Something went wrong',
            },
            code:500
        }
        return errorResponse(req,res,responseData) 
    }
}
const storLocationList = async (req,res,next) => {
    // return testResponse(req,res,'hello')
    /* get store list */
    try {
        let result = await User.aggregate([
            {
                $lookup:{
                    "from": "roles",
                    "let": { "role_id": "$role" },
                    "pipeline": [
                        {
                            "$match":
                            {
                                
                                "$expr":
                                {
                                    "$and":[
                                        {
                                            "$in": ["$_id", "$$role_id"]
                                        },
                                        {
                                            "$eq": ["$name", "Vendor"]
                                        },
                                    ]
                                }
                                
                            }
                        },
                    ],
                    "as":"roleData"
                }
            },
            {
                $lookup:{
                    "from":"categories",
                    "let":{"categortIds":"$vendor_profile.category"},
                    "pipeline":[
                        {
                            "$match":{
                                "$expr":{
                                    "$in": ["$_id", "$$categortIds"]
                                }
                                
                            }
                        }
                    ],
                    "as":"categoriesList"
                }
            },
            {
                $lookup:{
                    "from":"menuitems",
                    "localField":"_id",
                    "foreignField":"vendorId",
                    "as":"productList"
                }  
            },
            {
                $addFields : {
                    "roleDataSize" : {$size : "$roleData"},
                    "productSize":{$size:"$productList"},
                    "categoryCount":{$size:"$categoriesList"}
                }
            },
            {
                $match:{
                    "roleDataSize" : {$ne:0},
                    "productSize" : {$ne:0},
                    "categoryCount" : {$ne:0},
                    "status":true,
                }
            },
            {
                $project:{
                    _id:0,
                    name:1,
                    lat:"$vendor_profile.location.late",
                    lng:"$vendor_profile.location.lng"
                }
            }
        ]);
        responseData={
            data:{
                statusCode:200,
                message:"Location list",
                data:result
            },
            code:200
        }
        return successResponse(req,res,responseData);
    } catch (error) {
        console.log('error',error);
        responseData={
            data:{
                statusCode:500,
                message:'Something went wrong',
            },
            code:500
        }
        return errorResponse(req,res,responseData) 
    }
   
}
const sendVerification = async (req,res,next) =>{
    let responseData = {}
    try {
        let reqData = req.body
        let authUser = await User.findById(req.user._id)
        if (reqData.type=="email") {
            if(authUser.driver_profile.emailVarified){
                responseData={
                    data:{
                        statusCode:400,
                        message:'Already varified',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData) 
            }else{
                let  token = crypto.randomBytes(50).toString('hex')
                await new DVar({
                    driverId:authUser._id,
                    type:0,
                    token:token
                }).save() 
                /* send token to mail */
                let mailTempData={
                    link:`${process.env.MAIN_URL}mailverified?token=${token}`,
                }
                let temp = await ejs.renderFile(path.join(__basedir+'/mail-temp/verified.ejs'),mailTempData)
                let mailData = {
                    to:authUser.email,
                    subject:'Email Verification',
                    temp:temp
                }
                let mailResponse = await sendEmail(mailData)
                if (!mailResponse) {
                    responseData={
                        data:{
                            statusCode:400,
                            message:'Email not sent',
                        },
                        code:400
                    }
                    return errorResponse(req,res,responseData)
                }
            }
        }else{
            if(authUser.driver_profile.phoneVarified){
                responseData={
                    data:{
                        statusCode:400,
                        message:'Already varified',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData) 
            }else{
                await new DVar({
                    driverId:authUser._id,
                    type:1,
                    token:'1111'
                }).save() 
            }
        }
        responseData={
            data:{
                statusCode:200,
                message:"Verification token send",
                data:{}
            },
            code:200
        }
        return successResponse(req,res,responseData);
    } catch (error) {
        console.log('error',error);
        responseData={
            data:{
                statusCode:500,
                message:'Something went wrong',
            },
            code:500
        }
        return errorResponse(req,res,responseData) 
    }
}
/* Driver Verification api's start */
    // varified email and phone number
    const verifiedVerification = async (req,res,next) =>{
        let responseData = {}
        try {
            let reqData = req.body
            let authUser = await User.findById(req.user._id)
            let result = await DVar.findOne({
                driverId:authUser._id,
                type:reqData.type=="email"?0:1,
            }).sort({_id:-1})
            if (result && result.token === reqData.verify_token) {
                if (result.status) {
                    responseData={
                        data:{
                            statusCode:400,
                            message:'Token Expire',
                        },
                        code:400
                    }
                    return errorResponse(req,res,responseData)
                }else{
                    if (reqData.type=="email") {
                        authUser.driver_profile.emailVarified= true;
                    }else{
                        authUser.driver_profile.phoneVarified= true;
                    }
                    authUser.save()
                    result.status = true;
                    result.save()
                }
            }else{
                responseData={
                    data:{
                        statusCode:400,
                        message:'Token wrong',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData) 
            }
            responseData={
                data:{
                    statusCode:200,
                    message:"Verified",
                    data:{}
                },
                code:200
            }
            return successResponse(req,res,responseData);
        } catch (error) {
            console.log('error',error);
            responseData={
                data:{
                    statusCode:500,
                    message:'Something went wrong',
                },
                code:500
            }
            return errorResponse(req,res,responseData) 
        }
    }
    const emailVarificationWeb = async (req,res,next) =>{
        let responseData = {}
        try {
            let reqData = req.body
            let result = await DVar.findOne({
                token:reqData.verify_token,
                type:0
            }).sort({_id:-1})
            if (result) {
                if (result.status) {
                    responseData={
                        data:{
                            statusCode:400,
                            message:'Token Expire',
                        },
                        code:400
                    }
                    return errorResponse(req,res,responseData)
                }else{
                    await User.findByIdAndUpdate(result.driverId,{$set:{
                        "driver_profile.emailVarified":true
                    }})
                    result.status = true;
                    result.save()
                    otherEventHandler({
                        type:"emailVerified",
                        driverId:result.driverId,
                        emailVarified:true
                    })
                    responseData={
                        data:{
                            statusCode:200,
                            message:"Verified",
                            data:{}
                        },
                        code:200
                    }
                    return successResponse(req,res,responseData);
                }
            }else{
                responseData={
                    data:{
                        statusCode:400,
                        message:'Token wrong',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData) 
            }
            
        } catch (error) {
            console.log('error',error);
            responseData={
                data:{
                    statusCode:500,
                    message:'Something went wrong',
                },
                code:500
            }
            return errorResponse(req,res,responseData) 
        }
    }
/* Driver Verification api's end */
/* update live location */
const udpateDriverCurrentLocation = async (req,res,next)=>{
    let responseData = {}
    try {
        let reqData = req.body
        // return testResponse(req,res,reqData)
        await User.findByIdAndUpdate(req.user._id,{$set:{
            "driver_profile.currentLocation.coordinates":[reqData.lng,reqData.lat]
        }})
        responseData={
            data:{
                statusCode:200,
                message:"Location update",
                data:{}
            },
            code:200
        }
        return successResponse(req,res,responseData);
    } catch (error) {
        console.log('error',error);
        responseData={
            data:{
                statusCode:500,
                message:'Something went wrong',
            },
            code:500
        }
        return errorResponse(req,res,responseData) 
    }
}
/* Forget Password function start*/
const forgetPassword = async(req,res,next) => {
    let responseData = {}
    try {
        let reqData=req.body;
        let result =await User.findOne({email:reqData.email}).populate('role');
        if (!result || !result.role.some(data=> data.name ==="Driver")) {
            responseData={
                data:{
                    statusCode:401,
                    message:'Email is not authenticate',
                },
                code:401
            }
            return errorResponse(req,res,responseData)
        }
        let  token = Math.random().toString().substr(2, 6)
        let resetToken = new ResetToken({
            user_id:result._id,
            token:token
        })
        await resetToken.save()
        let mailTempData={
            otp:token,
        }
        let temp = await ejs.renderFile(path.join(__basedir+'/mail-temp/forgetOtp.ejs'),mailTempData)
        let mailData = {
            to:result.email,
            subject:'Reset Password',
            temp:temp
        }
        let mailResponse = await sendEmail(mailData)
        if (mailResponse) {
            responseData={
                data:{
                    statusCode:200,
                    message:'Please check your email for password reset details.',
                    data:reqData
                },
                code:200
            }
            return successResponse(req,res,responseData)    
        }else{
            responseData={
                data:{
                    statusCode:400,
                    message:'Email not sent',
                },
                code:400
            }
            return errorResponse(req,res,responseData)
        }
    } catch (error) {
        console.log('error',error);
        responseData={
            data:{
                statusCode:500,
                message:'Something went wrong',
            },
            code:500
        }
        return errorResponse(req,res,responseData)
    }
}
const resetPassword = async(req,res,next) => {
    let responseData = {}
    try {
        let curDate = new Date()
        let reqData=req.body;
        let result = await ResetToken.aggregate([
            {
                $match:{
                    token:reqData.token
                },
            },
            {
                $project:{
                    'user_id':1,
                    "diff":{ $divide: [{ $subtract: [curDate, "$createdAt"] }, 60000] }
                }
            },
            {
                $match:{
                    "diff":{$lte:10}
                }
            }
        ])
        if (result.length==0) {
            responseData={
                data:{
                    statusCode:400,
                    message:'Token Expire',
                },
                code:400
            }
            return errorResponse(req,res,responseData)
        }else{
            await User.findByIdAndUpdate(result[0].user_id,
                {
                    $set:{ password:bcrypt.hashSync(reqData.new_pass,10)}
                });
                await ResetToken.deleteOne({user_id:result[0].user_id})
            responseData={
                data:{
                    statusCode:200,
                    message:"Password reset successfull",
                    data:{}
                },
                code:200
            }
            return successResponse(req,res,responseData);
        }
    } catch (error) {
        console.log('error',error);
        responseData={
            data:{
                statusCode:500,
                message:'Something went wrong',
            },
            code:500
        }
        return errorResponse(req,res,responseData)
    }
} 
/* Forget Password function end*/
/* functions end */
module.exports={signUp, login, profile, updateProfileImage, update, updatePass, forgetPassword, resetPassword, onlineStatus, storLocationList, udpateDriverCurrentLocation, sendVerification, verifiedVerification, emailVarificationWeb}
