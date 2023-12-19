const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ResetToken = require('../../models/ResetTokenModel');
const User = require('../../models/usersModel');
const Role = require('../../models/roleModel');
const crypto = require("crypto");
const path = require('path');
const ejs = require('ejs');
const { successResponse, errorResponse, testResponse } = require('../../helper');
/* functions start */
const signUp= async (req,res,next)=>{
    let responseData={};
    try {
        let reqData=req.body;
        /* get role and asign to user */
        let roleId = await Role.findOne({name:"Admin"})
        const user = new User({
            name:reqData.name,
            email:reqData.email,
            password:bcrypt.hashSync(reqData.password,10),
            phone_no:reqData.phone_no,
            role:[roleId._id]
        });
        let result =await user.save();
        responseData={
            data:{
                statusCode:200,
                message:'success',
                data:result
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
        if (!result || result.role[0].name!=="Admin") {
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
            role:result.role
        }
        let token = jwt.sign(userData,process.env.SECRET_KEY_JWT,{expiresIn:"30d"})
        userData.token=token;
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
        let result =await User.findOne({_id:reqData._id}).populate('role');
        let userData={
            _id:result._id,
            name:result.name,
            email:result.email,
            phone_no:result.phone_no,
            pro_image:result.pro_image,
            role:result.role
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
            phone_no:reqData.phone_no
        }
        if(req.files && 'pro_image' in req.files){
            updateUserData.pro_image = await fileUpload(req.files.pro_image)
        }
        let updateUser=await User.findOneAndUpdate({_id:authUser._id},updateUserData,{new:true}).populate('role');
        let userData={
            _id:updateUser._id,
            name:updateUser.name,
            email:updateUser.email,
            phone_no:updateUser.phone_no,
            pro_image:updateUser.pro_image,
            role:updateUser.role
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
        await User.findOneAndUpdate({_id:authUser._id},{password:bcrypt.hashSync(reqData.new_pass,10)});
        responseData={
            data:{
                statusCode:201,
                message:"Password update successfull",
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

/* Forget Password function start*/
const forgetPassword = async(req,res,next) => {
    let responseData = {}
    try {
        let reqData=req.body;
        let result =await User.findOne({email:reqData.email}).populate('role');
        if (!result || !result.role.some(data=> data.name ==="Admin")) {
            responseData={
                data:{
                    statusCode:401,
                    message:'Email is not authenticate',
                },
                code:401
            }
            return errorResponse(req,res,responseData)
        }
        let  token = crypto.randomBytes(50).toString('hex');
        let resetToken = new ResetToken({
            user_id:result._id,
            token:token
        })
        await resetToken.save()
        let mailTempData={
            link:`${process.env.ADMIN_URL}reset-password?token=${token}`,
        }
        let temp = await ejs.renderFile(path.join(__basedir+'/mail-temp/forget.ejs'),mailTempData)
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
module.exports={signUp,login,profile,update,updatePass,forgetPassword,resetPassword}
