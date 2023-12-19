const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const User = require('../../models/usersModel');
const ResetToken = require('../../models/ResetTokenModel');
const CategoryType = require('../../models/categoryTypeModel');
const Category = require('../../models/categoryModel');
const { successResponse, errorResponse, testResponse } = require('../../helper');
const VendorTiming = require('../../models/vendorTiming');
const VendorImage = require('../../models/VendorImagesModel');
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
        if (!result || !result.role.some(data=> data.name ==="Vendor")) {
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
            if (!result || !result.role.some(data=> data.name ==="Vendor")) {
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
                link:`${process.env.VENDOR_URL}reset-password?token=${token}`,
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
                    $lookup:{
                        'from':'roles',
                        'let':{"role_ids":"$role"},
                        'pipeline':[
                        {
                            $match:{
                                $expr:{
                                    $in: ["$_id","$$role_ids"]
                                }
                            }
                        } 
                        ],
                        "as":'roleDetails'
                    }
                },
                // {
                //     $lookup:{
                //         'from':'categories',
                //         'let':{"category_ids":"$vendor_profile.category"},
                //         'pipeline':[
                //         {
                //             $match:{
                //                 $expr:{
                //                     $in: ["$_id","$$category_ids"]
                //                 }
                //             }
                //         },
                //         {
                //                 $project : {
                //                     "_id":0,
                //                 "value":"$_id",
                //                 "label":"$title"
                //                 }
                //         }
                //         ],
                //         "as":'catDetails'
                //     }
                // },
                {
                    $lookup:{
                        'from':'vendortimings',
                        'localField':"_id",
                        'foreignField':"vendorId",
                        "as":'vendorTiming'
                    }
                },
                {
                    $lookup:{
                        'from':'vendorimages',
                        'let':{"vendor_id":"$_id"},
                        'pipeline':[
                            {
                                $match:{
                                    $expr:{
                                        $eq: ["$vendorId","$$vendor_id"]
                                    }
                                }
                            },
                            {
                                $project : {
                                    "img_type":1,
                                    "image":{
                                        $cond: {
                                            if:{$ne : ["$image", null]},
                                            then:{$concat:[process.env.PUBLIC_FOLDER_URL,"$image"]},
                                            else:{$concat:[process.env.PUBLIC_FOLDER_URL,"img01.jpg"]}
                                        }
                                    }
                                }
                            }
                        ],
                        "as":'vendorImages'
                    }
                },
                {
                    $project:{
                        "name":1,
                        "email":1,
                        "pro_image":{
                            $cond: {
                                if:{$ne : ["$pro_image", null]},
                                then:{$concat:[process.env.PUBLIC_FOLDER_URL,"$pro_image"]},
                                else:{$concat:[process.env.PUBLIC_FOLDER_URL,"user.jpg"]}
                            }
                        },
                        "phone_no":1,
                        "status":1,
                        "role":"$roleDetails",
                        "createdAt":1,
                        "vendor_profile._id":1,
                        "vendor_profile.typeOf":1,
                        "vendor_profile.category":1,
                        "vendor_profile.location":1,
                        "vendor_profile.commission":1,
                        "vendor_profile.preparation_time":1,
                        "vendor_profile.minimum_amount":1,
                        "vendor_profile.contactPerson":1,
                        "vendor_profile.hygiene_url":1,
                        "vendorTiming":{
                            $cond: {
                                if: { $gt : [{"$size":"$vendorTiming"},0]},
                                then:{"$first":'$vendorTiming'},
                                else:{}
                            }
                        },
                        "vendorImages":1,
                        
                    }
                }
            ]);
            let type = await CategoryType.find({},{
                "value":"$_id",
                "label":"$title"
            }).select('-_id')
            let category = await Category.find({type:result[0].vendor_profile.typeOf},{
                "value":"$_id",
                "label":"$title"
            }).select('-_id')
            responseData={
                data:{
                    statusCode:200,
                    message:'success',
                    data:{
                        profile_data:result[0],
                        vendorType:type,
                        categoryList:category
                    }
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

    const updateGeneralProfile = async (req,res,next)=>{

        let responseData = {}
        try {
            let authUser = req.user
            let reqData=req.body;
            // return testResponse(req,res,reqData)
            let updateData={
                name:reqData.name,
                phone_no:reqData.phone_no,
                "vendor_profile.category":reqData.category.split(","),
                "vendor_profile.location.address": reqData.address,
                "vendor_profile.location.late": reqData.lat || null,
                "vendor_profile.location.lng": reqData.lng || null,
                "vendor_profile.location.location.type":"Point",
                "vendor_profile.location.location.coordinates":[reqData.lng || 0,reqData.lat || 0] ,
                "vendor_profile.contactPerson.name": reqData.contact_person_name,
                "vendor_profile.contactPerson.email": reqData.contact_person_email,
                "vendor_profile.contactPerson.phone_no": reqData.contact_person_phone_no,
                "vendor_profile.preparation_time": reqData.preparation_time,
                "vendor_profile.minimum_amount": reqData.minimum_amount,
            }
            if(req.files && 'logo' in req.files){
                updateData.pro_image = await fileUpload(req.files.logo)
            }
            let result = await User.findByIdAndUpdate(authUser._id,{$set:updateData})
            // console.log("result",result);
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
    const updateVendorTiming = async (req,res,next)=>{
        let responseData = {}
        try {
            let authUser = req.user
            let reqData=req.body;
            let updateData={
                "timing.monday.open": reqData.mon_open||'',
                "timing.monday.close": reqData.mon_close||'',
                "timing.monday.isClose": false,
                "timing.tuesday.open": reqData.tue_open||'',
                "timing.tuesday.close": reqData.tue_close||'',
                "timing.tuesday.isClose": false,
                "timing.wednesday.open": reqData.wed_open||'',
                "timing.wednesday.close": reqData.wed_close||'',
                "timing.wednesday.isClose": false,
                "timing.thursday.open": reqData.thu_open||'',
                "timing.thursday.close": reqData.thu_close||'',
                "timing.thursday.isClose": false,
                "timing.friday.open": reqData.fri_open||'',
                "timing.friday.close": reqData.fri_close||'',
                "timing.friday.isClose": false,
                "timing.saturday.open": reqData.sat_open||'',
                "timing.saturday.close": reqData.sat_close||'',
                "timing.saturday.isClose": false,
                "timing.sunday.open": reqData.sun_open||'',
                "timing.sunday.close": reqData.sun_close||'',
                "timing.sunday.isClose": false,
            }
            let result =await VendorTiming.findOneAndUpdate({vendorId:authUser._id},{$set:updateData},{upsert:true})
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
    const updateVendorBank = async (req,res,next)=>{

    }
    const saveVendorImages = async (req,res,next)=>{
        // return testResponse(req,res,'hello')
        let responseData = {}
        try {
            let authUser = req.user;
            /* check image is valid or not start*/
            let checkData = await VendorImage.find({vendorId:authUser._id,img_type:req.body.type})
            // return testResponse(req,res,checkData.length)
            if ((req.body.type == 'other' && checkData.length >= 4) || (req.body.type == 'main' && checkData.length >= 1)) {
                responseData={
                    data:{
                        statusCode:400,
                        message:'Image Upload Limit Exceeded',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData) 
            }
            /* check image is valid or not end*/
            let uploadData = {
                img_type:req.body.type,
                vendorId:authUser._id,
                image: await fileUpload(req.files.image,'storeimage/')
            }
            let vendorImg = new VendorImage(uploadData)
            let result =  await  vendorImg.save()
            let sendResult = {
                _id:result._id,
                img_type:result.img_type,
                image:result.image
            }
            responseData={
                data:{
                    statusCode:200,
                    message:'success',
                    data:sendResult
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
    const removeVendorImages = async (req,res,next)=>{
        let responseData = {}
        try {
            let imageData = await  VendorImage.findById(req.body.imgId);
            let imagePath = await fileUrlRemove(imageData.image)
            fs.unlinkSync(path.join('public',imagePath))
            imageData.deleteOne();
            responseData={
                data:{
                    statusCode:200,
                    message:'success',
                    data:{}
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
/* profile related function end */
/* function end */
module.exports = {login,getAuthUser,profile,updateGeneralProfile,updatePassword,updateVendorTiming,updateVendorBank,saveVendorImages,removeVendorImages,forgetPassword,resetPassword}