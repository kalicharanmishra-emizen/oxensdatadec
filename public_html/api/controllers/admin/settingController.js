const { successResponse, errorResponse, testResponse} = require('../../helper');
const OAssign = require('../../models/Setting/orderAssignSettingModel')
const Setting = require('../../models/Setting/mainSettingModel')
/* functions Start */
    const orderSettingList = async (req,res,next) =>{
        let responseData = {}
        try {
            let result = await OAssign.find({},{__v:0})
            responseData={
                data:{
                    statusCode:200,
                    message:"success",
                    data:result
                },
                code:200
            }
            return successResponse(req,res,responseData);
        } catch (error) {
            console.log('error',error)
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
    const orderSettingDetail = async (req,res,next) => {
        let responseData = {}
        try {
            let reqData = req.body
            if (reqData.id == undefined || reqData.id=='') {
                responseData={
                    data:{
                        statusCode:401,
                        message:'Order assign id is required',
                    },
                    code:401
                }
                return errorResponse(req,res,responseData)
            }
            let result = await OAssign.findById(reqData.id,{__v:0})
            responseData={
                data:{
                    statusCode:200,
                    message:"success",
                    data:result
                },
                code:200
            }
            return successResponse(req,res,responseData);
        } catch (error) {
            console.log('error',error)
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
    const orderSettingUpdate = async (req,res,next) => {
        let responseData = {}
        try {
            let reqData = req.body
            await OAssign.findByIdAndUpdate(reqData.id,{
                $set:{
                    maxDistance:reqData.maxDistance,
                    packageLimit:reqData.packageLimit,
                }
            })
            responseData={
                data:{
                    statusCode:200,
                    message:"success",
                    data:{}
                },
                code:200
            }
            return successResponse(req,res,responseData);
        } catch (error) {
            console.log('error',error)
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
    const mainSetting = async (req,res,next) =>{
        let responseData = {}
        try {
            let result = await Setting.findOne({},{
                _id:0,
                id:"$_id",
                driverWaitTime:1,
                deliveryDis:1,
                serviceFee:1,
                maxServiceFee:1,
                vatCharge:1,
                deliveryDistance:1,
                minDeliveryCharge:1,
                deliveryExtraFeeUnit:1,
                fixLimitDeliveryDistance:1,
                deliveryExtraFee:1,
                fixDriverDistance:1,
                minDriverPayFirst:1,
                extraDriverPaySecond:1,
                deliveryExtraPayUnit:1,
                deliveryExtraPay:1,
                taxPay:1
            });
            responseData={
                data:{
                    statusCode:200,
                    message:"success",
                    data:result
                },
                code:200
            }
            return successResponse(req,res,responseData);
        } catch (error) {
            console.log('error',error)
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
    const mainSettingUpdate = async (req,res,next) =>{
        let responseData = {}
        try {
            let reqData = req.body
            let result = await Setting.findByIdAndUpdate(reqData.id,{
                $set:{
                    driverWaitTime:reqData.driverWaitTime,
                    deliveryDis:reqData.deliveryDis,
                    serviceFee:reqData.serviceFee,
                    maxServiceFee:reqData.maxServiceFee,
                    vatCharge:reqData.vatCharge,
                    deliveryDistance:reqData.deliveryDistance,
                    minDeliveryCharge:reqData.minDeliveryCharge,
                    deliveryExtraFeeUnit:reqData.deliveryExtraFeeUnit,
                    fixLimitDeliveryDistance:reqData.fixLimitDeliveryDistance,
                    deliveryExtraFee:reqData.deliveryExtraFee,
                    fixDriverDistance:reqData.fixDriverDistance,
                    minDriverPayFirst:reqData.minDriverPayFirst,
                    extraDriverPaySecond:reqData.extraDriverPaySecond,
                    deliveryExtraPayUnit:reqData.deliveryExtraPayUnit,
                    deliveryExtraPay:reqData.deliveryExtraPay,
                    taxPay:reqData.taxPay
                }
            },{
                fields: {
                    _id:0,
                    id:"$_id",
                    driverWaitTime:1,
                    deliveryDis:1,
                    serviceFee:1,
                    maxServiceFee:1,
                    vatCharge:1,
                    deliveryDistance:1,
                    minDeliveryCharge:1,
                    deliveryExtraFeeUnit:1,
                    fixLimitDeliveryDistance:1, 
                    deliveryExtraFee:1,
                    fixDriverDistance:1,
                    minDriverPayFirst:1,
                    extraDriverPaySecond:1,
                    deliveryExtraPayUnit:1,
                    deliveryExtraPay:1,
                    taxPay:1
                },
                new:true
            });
            responseData={
                data:{
                    statusCode:200,
                    message:"success",
                    data:result
                },
                code:200
            }
            return successResponse(req,res,responseData);
        } catch (error) {
            console.log('error',error)
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
/* functions end */
module.exports = {orderSettingList, orderSettingDetail, orderSettingUpdate, mainSetting,mainSettingUpdate}