const ReviewRatingModel = require("../../models/reviewRateingModel");
const { successResponse, errorResponse, convortToObjID, fileUpload } = require('../../helper');
const HelpModel = require("../../models/HelpModel");
/* function start */

    const userRating = async (req,res,next) => {
        let responseData={}
        try {
            let reqData = req.body
            reqData['user_id'] = req.user._id
            
            if (reqData.type==='order') {
                delete reqData.driverId
            }else if(reqData.type==='driver'){
                delete reqData.storeId
            }
            
            const result = await new ReviewRatingModel(reqData).save()
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

    const help = async (req, res) => {
        try {
            let reqData = req.body
            let rowData = new HelpModel({
                user_id : req.user._id,
                orderId : reqData.orderId,
                storeId : reqData.storeId,
                file : req?.files?.file ? await fileUpload(req?.files?.file,'help/') : null,
                selectReason : reqData.selectReason,
                description : reqData.description?reqData.description:null,
            })
            let result = await rowData.save()

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
    
/* function End */

module.exports = { userRating, help }