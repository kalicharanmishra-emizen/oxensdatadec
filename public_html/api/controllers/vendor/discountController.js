const { successResponse, errorResponse, testResponse, convortToObjID } = require('../../helper');
const Discount = require('../../models/Discount/discountModel');

/* discount function start */
    const detail = async (req,res,next) => {
        let responseData = {}
        try {
            let authUser = req.user
            let result = await Discount.findOne({storeId:authUser._id},{
                _id:0,
                discountType:1,
                discountValue:1,
                maxDiscount:1
            })
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
    const update = async (req,res,next) => {
        let responseData = {}
        try {
            let authUser = req.user
            let reqData = req.body
            let returnData = {}
            reqData.discountType = Number(reqData.discountType)
            let result = await Discount.findOne({storeId:authUser._id})
            if (result) {
                result.discountType = reqData.discountType
                if(!reqData.discountType){
                    result.discountValue = reqData.discountValue
                }else{
                    result.discountValue = 0
                }
                result.maxDiscount = reqData.maxDiscount
                await result.save()
                returnData = {
                    discountType:result.discountType,
                    discountValue:result.discountValue,
                    maxDiscount:result.maxDiscount
                }
            } else {
                const saveData = {
                    storeId:authUser._id,
                    discountType:reqData.discountType,
                    maxDiscount:reqData.maxDiscount
                }
                if (!reqData.discountType) {
                    saveData['discountValue']=reqData.discountValue
                }
                const result = await new Discount(saveData).save();
                returnData={
                    discountType:result.discountType,
                    discountValue:result.discountValue,
                    maxDiscount:result.maxDiscount
                }
            }
            responseData={
                data:{
                    statusCode:200,
                    message:'success',
                    data:returnData
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
/* discount function end */
module.exports = { detail, update }