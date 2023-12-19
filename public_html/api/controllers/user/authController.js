const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ResetToken = require('../../models/ResetTokenModel');
const User = require('../../models/usersModel');
const Role = require('../../models/roleModel');
const { successResponse, errorResponse, testResponse, xeroTokenGenrate, xeroTenantDetail, xeroUserRegister } = require('../../helper');
const path = require('path');
const ejs = require('ejs');
const crypto = require("crypto");
/* function start */
const login = async (req,res,next) => {
    // return testResponse(req,res,req.body)
    let responseData={};
    try {
        let reqData=req.body;
        let result =await User.findOne({email:reqData.email}).populate('role');
        // return testResponse(req,res,result)
        if (!result || !result.role.some(data=> data.name ==="User")) {
            responseData={
                data:{
                    statusCode:401,
                    message:'Email or Password are incorrect',
                },
                code:401
            }
            return errorResponse(req,res,responseData)
        }
        if (!result.status) {
            responseData={
                data:{
                    statusCode:401,
                    message:'Your account is block by admin. Please contact to admin.',
                },
                code:401
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
            role:result.role,
            dob:result.user_profile.dob
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
const signup = async (req,res,next) => {
    // return testResponse(req,res,req.body)
    let responseData={};
    try {
        let reqData=req.body;

        // xero token get
        let clientId = process.env.XERO_CLIENT_ID;
        let clientSecret = process.env.XERO_SECRET_KEY;
        let xeroConnectTknApi = process.env.XERO_CONNECT_TOKEN_API;
        const xeroGetToken = await helper.xeroTokenGenrate(clientId, clientSecret, xeroConnectTknApi);
        // const xeroAccessToken = JSON.parse(xeroGetToken);
        console.log("Final Data get it what i got ---------------------",xeroGetToken);

        // xero get tenant id
        let xeroTenantApi = process.env.XERO_TENANT_DETAIL_API;
        const xeroGetTenantId = await helper.xeroTenantDetail(xeroGetToken, xeroTenantApi);
        console.log("get tenant id: ",xeroGetTenantId);

        // xero tenant user register
        let xeroContactCreateApi = process.env.XERO_USER_REGISTER_API;
        data = {
            "Contacts": [
                {
                "Name": reqData.name,
                "FirstName": reqData.name,
                // "LastName": "customer2",
                "EmailAddress": reqData.email,
                // "Phones":reqData.phone_no,
                "IsCustomer":"true",
                "ContactPersons": [
                    {
                    "FirstName": reqData.name,
                    // "LastName": "Smith",
                    "EmailAddress": reqData.email,
                    "IncludeInEmails": "true",
                    // "Phones":reqData.phone_no
                    }
                ]
                }
            ]
        }
        
        const xeroContactCreate = await helper.xeroUserRegister(xeroGetTenantId, xeroGetToken, xeroContactCreateApi, data);
        console.log("xero contact user create: ",xeroContactCreate);

        /* get role and asign to user */
        let roleId = await Role.findOne({name:"User"})
        const user = new User({
            name:reqData.name,
            email:reqData.email,
            password:bcrypt.hashSync(reqData.password,10),
            phone_no:reqData.phone_no,
            user_profile:{
                dob:reqData.dob
            },
            role:[roleId._id],
            contact_id:xeroContactCreate.Contacts[0].ContactID
        });
        let result =await user.save();
        let userData={
            _id:result._id,
            name:result.name,
            email:result.email,
            phone_no:result.phone_no,
            role:result.role,
            dob:result.user_profile.dob
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
const getAuthUser = async (req,res,next) =>{
    let responseData={};
    try {
        let reqData=req.user;
        responseData={
            data:{
                statusCode:200,
                message:'success',
                data:reqData
            },
            code:200
        }
        return successResponse(req,res,responseData)
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
            if (!result || !result.role.some(data=> data.name ==="User")) {
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
            // let token = jwt.sign({user:result._id},process.env.SECRET_KEY_JWT,{expiresIn:"1h"})
            let mailTempData={
                link:`${process.env.MAIN_URL}reset-password?token=${token}`,
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
/* profile related function start */
    const profile = async(req,res,next)=>{    
        let responseData={};
        try {
            let reqData=req.user;
            let result = await User.aggregate([
                {
                    $match:{
                        '_id':reqData._id
                    }
                },
                {
                    $project:{
                        "name":1,
                        "email":1,
                        "phone_no":1,
                        "status":1,
                        "createdAt":1,
                        "dob":"$user_profile.dob"
                    }
                }
            ]);
            responseData={
                data:{
                    statusCode:200,
                    message:'success',
                    data:result[0]
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

    const updateProfile = async (req,res,next)=>{

        let responseData = {}
        try {
            let authUser = req.user
            let reqData=req.body;
            // return testResponse(req,res,reqData)
            let updateData={
                name:reqData.name,
                email:reqData.email,
                phone_no:reqData.phone_no,
                "user_profile.dob":reqData.dob
            }
            let result =await User.findByIdAndUpdate(authUser._id,{$set:updateData})
            responseData={
                data:{
                    statusCode:200,
                    message:'success',
                    data:{}
                },
                code:200
            }
            return successResponse(req,res,responseData)
        } catch (e) {
            console.log('exp',e);
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
    const updatePassword = async (req,res,next) => {
        let responseData={}
        let authUser=req.user;
        try {
            let reqData = req.body;
            await User.findByIdAndUpdate(authUser._id,
                {
                    $set:{ password:bcrypt.hashSync(reqData.new_pass,10)}
                });
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
/* profile related function end */
/* function end */
module.exports = {login,signup,getAuthUser,profile,updateProfile,updatePassword,forgetPassword,resetPassword}