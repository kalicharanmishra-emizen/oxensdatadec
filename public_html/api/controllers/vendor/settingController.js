const { successResponse, errorResponse} = require('../../helper');
const Setting = require('../../models/Setting/vendorMainSettingModel')
/* functions Start */
    const mainSetting = async (req,res,next) =>{
        let responseData = {}
        try {
            const reqData = req.body
            const existRecord = await Setting.findOne({storeId:reqData.storeId})
            if (!existRecord) {
                await new Setting({
                    storeId:reqData.storeId,
                    fixLimitDeliveryDistance:0,
                    deliveryDistance:0,
                    minDeliveryCharge:0,
                    deliveryExtraFeeUnit:0,
                    deliveryExtraFee:0,
                }).save()   
            }    
            
            let result = await Setting.findOne({storeId:reqData.storeId},{
                _id:0,
                id:"$_id",
                fixLimitDeliveryDistance:1,
                deliveryDistance:1,
                minDeliveryCharge:1,
                deliveryExtraFeeUnit:1,
                deliveryExtraFee:1,
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
                    fixLimitDeliveryDistance:reqData.fixLimitDeliveryDistance,
                    deliveryDistance:reqData.deliveryDistance,
                    minDeliveryCharge:reqData.minDeliveryCharge,
                    deliveryExtraFeeUnit:reqData.deliveryExtraFeeUnit,
                    deliveryExtraFee:reqData.deliveryExtraFee,
                }
            },{
                fields: {
                    _id:0,
                    id:"$_id",
                    fixLimitDeliveryDistance:1,
                    deliveryDistance:1,
                    minDeliveryCharge:1,
                    deliveryExtraFeeUnit:1,
                    deliveryExtraFee:1,
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
module.exports = {mainSetting,mainSettingUpdate}