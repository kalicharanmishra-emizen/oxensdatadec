const { successResponse, errorResponse, testResponse } = require('../../helper');
const Address = require('../../models/addressModel');
/* function start */
    const list = async (req,res,next) =>{
        let responseData = {}
        try {
            let auth = req.user
            let result =  await Address.find(
                {
                    userId:auth._id
                },
                {
                    __v:0,
                    userId:0
                },
                {
                    sort:{createdAt :-1}
                }
            )
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
    const create = async (req,res,next) =>{
        let responseData = {}
        try {
            let auth = req.user
            let reqData = req.body
            let rawData = new Address({
                userId:auth._id,
                tag:reqData.tag,
                address:reqData.location.address,
                area:reqData.location.area,
                lat:reqData.location.lat,
                lng:reqData.location.lng,
                location:{
                    coordinates:[reqData.location.lng,reqData.location.lat]
                }
            })
            await rawData.save()
            let result =  await Address.find({userId:auth._id},{__v:0,userId:0},{sort:{createdAt :-1}})
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
    const update = async (req,res,next) =>{
        let responseData = {}
        try {
            let auth = req.user
            let reqData = req.body
            await Address.findByIdAndUpdate(reqData.id,{
                $set:{
                    tag:reqData.tag,
                    address:reqData.location.address,
                    area:reqData.location.area,
                    lat:reqData.location.lat,
                    lng:reqData.location.lng,
                    location:{
                        coordinates:[reqData.location.lng,reqData.location.lat]
                    }
                }
            })
            let result =  await Address.find({userId:auth._id},{__v:0,userId:0},{sort:{createdAt :-1}})
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
    const destory = async (req,res,next) =>{
        let responseData = {}
        try {
            let auth = req.user
            let reqData = req.body
            await Address.findByIdAndDelete(reqData.addressId)
            let result =  await Address.find({userId:auth._id},{__v:0,userId:0},{sort:{createdAt :-1}})
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
/* function end */
module.exports = {list,create,update,destory}