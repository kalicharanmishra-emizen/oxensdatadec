const Cms = require('../../models/cmsModel');
const User = require("../../models/usersModel");
const Role = require("../../models/roleModel");
const Order = require("../../models/Order/orderModel");
const RiderSupport = require('../../models/Cms/supportReasonModel');
const RejectReason = require('../../models/Cms/rejectReasonModel');
const { successResponse, errorResponse, testResponse, createOrderLogs } = require('../../helper');

/* functions start */
    const list = async (req,res,next) => {
        let responseData ={}
        try {
            let result = await Cms.find({}).select(['title','slug']);
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
    const detail = async (req,res,next) =>{
        let responseData ={}
        try {
            let result = await Cms.findOne({slug:req.body.slug}).select('-__v') 
            if (result===undefined && result) {
                responseData={
                    data:{
                        statusCode:401,
                        message:'Page not Found',
                    },
                    code:401
                }
                return errorResponse(req,res,responseData)
            }
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
        let responseData ={}
        try {
            let reqData = req.body
            await Cms.findOneAndUpdate({slug:reqData.slug},{title:reqData.title,content:reqData.content})
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

    /* Rider Support function start */
        const riderSupportList = async (req,res,next) =>{
            let responseData = {}
            try {
                let result = await RiderSupport.find({})
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
        const riderSupportAdd = async (req,res,next) => {
            let responseData = {}
            try {
                let reqData = req.body
                await new RiderSupport({
                    title:reqData.title,
                    status:reqData.status
                }).save()
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
        const riderSupportUpdate = async (req,res,next) => {
            let responseData = {}
            try {
                let reqData = req.body
                await RiderSupport.findByIdAndUpdate(reqData._id,{$set:{
                    title:reqData.title,
                    status:reqData.status
                }})
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
        const riderSupportRemove = async (req,res,next) => {
            let responseData = {}
            try {
                let reqData = req.body
                await RiderSupport.findByIdAndDelete(reqData._id)
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
    /* Rider Support function end */
    /* Reject Reason function start */
        const rejectReasonList = async (req,res,next) =>{
            let responseData = {}
            try {
                let result = await RejectReason.find({})
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
        const rejectReasonAdd = async (req,res,next) => {
            let responseData = {}
            try {
                let reqData = req.body
                await new RejectReason({
                    title:reqData.title,
                    status:reqData.status
                }).save()
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
        const rejectReasonUpdate = async (req,res,next) => {
            let responseData = {}
            try {
                let reqData = req.body
                await RejectReason.findByIdAndUpdate(reqData._id,{$set:{
                    title:reqData.title,
                    status:reqData.status
                }})
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
        const rejectReasonRemove = async (req,res,next) => {
            let responseData = {}
            try {
                let reqData = req.body
                await RejectReason.findByIdAndDelete(reqData._id)
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
    /* Reject Reason function end */

    /* dashboard data start */
        const dashboardData = async (req, res) => {
            try {
                const userCount = await Role.aggregate([
                    {
                        $match:{
                            name:{ $ne: "Admin" }
                        }
                    },
                    {
                        $lookup:{
                            from:"users",
                            let:{roleID:"$_id"},
                            pipeline:[
                                {
                                    $match:{
                                        $expr:{
                                            $in:[ "$$roleID", "$role" ] 
                                        }
                                    }
                                }
                            ],
                            as:"userData"
                        }
                    },
                    {
                        $unwind:"$userData"
                    },
                    {
                        $group:{
                            _id:"$name",
                            userCount:{$count:{}},
                        }
                    },
                    {
                        $sort:{
                            _id:1,
                        }
                    }
                ])

                const topSellingStores = await User.aggregate([
                    {
                        $lookup:
                        {
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
                                {
                                    $project:{
                                        _id:1
                                    }
                                }
                            ],
                            "as":"roleData"
                        }
                    },
                    {
                        $addFields : {
                            "roleDataSize" : {$size : "$roleData"}
                        }
                    },
                    {
                        $match:{
                            "roleDataSize" : {
                                $ne : 0
                            }
                        }
                    },
                    {
                        $lookup:{
                            from:"orders",
                            let:{ venderId:"$_id" },
                            pipeline:[
                                {
                                    $match:{
                                        $expr:{
                                            $and:[
                                                { $eq: [ "$storeId", "$$venderId" ] },
                                                { $ne: [ "$status", 8 ] }
                                            ]
                                        }
                                    }
                                },
                            ],
                            as:"orderData"
                        }
                    },
                    {
                        $unwind:"$orderData"
                    },
                    {
                        $group:{
                            _id:{ "storeID":"$orderData.storeId", "orderStatus":"$orderData.status" },
                            orderCount:{ $count:{} },
                            venderName:{ $first:"$name" }
                        }
                    },
                    {
                        $group:{
                            _id:"$_id.storeID",
                            totalCount:{$sum:"$orderCount"},
                            venderName: { $first:"$venderName" },
                            data: {
                                $push: { 
                                    status:"$_id.orderStatus",
                                    statusCount:"$orderCount"
                                }
                            }
                        }
                    },
                    {
                        $sort:{
                            totalCount:-1
                        },
                    },
                    {
                        $limit:5
                    },
                    {
                        $project:{
                            totalCount:1,
                            storeName:"$venderName",
                            deliveredOrders:{
                                $reduce: {
                                   input: "$data",
                                   initialValue: 0,
                                   in: {
                                        $cond:{
                                            if:{$in:["$$this.status",[1,2,3,4,5,6]]},
                                            then:{$add: [ "$$value", "$$this.statusCount"] },
                                            else:{$add: [ "$$value", 0] }
                                        }
                                   }
                                }
                            },
                            processingOrders:{
                                $reduce: {
                                   input: "$data",
                                   initialValue: 0,
                                   in: {
                                        $cond:{
                                            if:{$in:["$$this.status",[1,2,3,4,5]]},
                                            then:{$add: [ "$$value", "$$this.statusCount"] },
                                            else:{$add: [ "$$value", 0] }
                                        }
                                   }
                                }
                            },
                            pendingOrders:{
                                $reduce: {
                                   input: "$data",
                                   initialValue: 0,
                                   in: {
                                        $cond:{
                                            if:{$in:["$$this.status",[0]]},
                                            then:{$add: [ "$$value", "$$this.statusCount"] },
                                            else:{$add: [ "$$value", 0] }
                                        }
                                   }
                                }
                            },
                            refundOrders:{
                                $reduce: {
                                   input: "$data",
                                   initialValue: 0,
                                   in: {
                                        $cond:{
                                            if:{$in:["$$this.status",[7]]},
                                            then:{$add: [ "$$value", "$$this.statusCount"] },
                                            else:{$add: [ "$$value", 0] }
                                        }
                                   }
                                }
                            }
                        }
                    }
                ])

                const currentYear = new Date().getFullYear()
                const [monthlyOrders] = await Order.aggregate([
                    {
                        $addFields:{
                            createYear:{ $year: "$createdAt" },
                            createMonth:{ $month: "$createdAt" }
                        }
                    },
                    {
                        $match:{
                            createYear:2022
                        }
                    },
                    { 
                        $facet:{
                           "thisYearSales": [ 
                               {
                                    $group:{
                                        _id:"$createMonth",
                                        monthSale:{ $sum: {$toDouble:"$totalPrice"} }
                                    }
                               },
                               {
                                    $sort:{
                                        _id:1
                                    }
                               }
                            ],
                            "thisYearOrders": [ 
                                {
                                    $group:{
                                        _id:"$createMonth",
                                        monthOrder:{ $count: {} }
                                    }
                                },
                                {
                                    $sort:{
                                       _id:1
                                    }
                                }
                             ],
                        }
                    }
                ])

                const topBuyers = await User.aggregate([
                    {
                        $addFields:{
                            createYear:{ $year : "$createdAt"},
                            createMonth: { $month : "$createdAt" }
                        }
                    },
                    {
                        $match:{
                            createYear:2023
                        }
                    },
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
                                                    "$eq": ["$name", "User"]
                                                },
                                                {
                                                    "$in": ["$_id", "$$role_id"]
                                                },
                                            ]
                                        }
                                    }
                                },
                                {
                                    $project:{
                                        _id:1
                                    }
                                }
                            ],
                            "as":"roleData"
                        }
                    },
                    {
                        $addFields : {
                            "roleDataSize" : {$size : "$roleData"}
                        }
                    },
                    {
                        $match:{
                            "roleDataSize" : {
                                $ne : 0
                            }
                        }
                    },
                    {
                        $lookup:{
                            from:"orders",
                            let:{ userID: "$_id" },
                            pipeline:[
                                {
                                    $match:{
                                        $expr:{
                                            $and:[
                                                { $eq: [ "$userId", "$$userID" ] },
                                                { $ne: [ "$status", 8 ] }
                                            ]
                                        }
                                    }
                                }
                            ],
                            as:"orderData"
                        }
                    },
                    {
                        $unwind:"$orderData"
                    },
                    {
                        $group:{
                            _id:{ "userId": "$orderData.userId", "orderStatus":"$orderData.status"},
                            orderCount:{ $count: {} },
                            orderMRP:{ $sum: {$toDouble:"$orderData.totalPrice"} },
                            userName:{ $first:"$name" } 
                        }
                    },
                    {
                        $group:{
                            _id:"$_id.userId",
                            totalOrders:{ $sum:"$orderCount" },
                            totalAmount:{ $sum:"$orderMRP" },
                            userName:{ $first:"$userName" },
                            data:{
                                $push:{
                                    status:"$_id.orderStatus",
                                    totalCount:"$orderCount",
                                    mrp:"$orderMRP"
                                }
                            }
                        }
                    },
                    {
                        $sort:{
                            orderCount:-1
                        }
                    },
                    {
                        $limit:5
                    },
                    {
                        $project:{
                            totalOrders:1,
                            totalAmount:1,
                            userName:"$userName",
                            deliveredOrdersAmount:{
                                $reduce: {
                                    input: "$data",
                                    initialValue: 0,
                                    in: {
                                        $cond:{
                                            if:{$in:["$$this.status",[1,2,3,4,5,6]]},
                                            then:{$add: [ "$$value", "$$this.mrp"] },
                                            else:{$add: [ "$$value", 0] }
                                        }
                                    }
                                }
                            },
                            deliveredOrders:{
                                $reduce: {
                                    input: "$data",
                                    initialValue: 0,
                                    in: {
                                        $cond:{
                                            if:{$in:["$$this.status",[1,2,3,4,5,6]]},
                                            then:{$add: [ "$$value", "$$this.totalCount"] },
                                            else:{$add: [ "$$value", 0] }
                                        }
                                    }
                                }
                            },
                            processingOrders:{
                                $reduce: {
                                   input: "$data",
                                   initialValue: 0,
                                   in: {
                                        $cond:{
                                            if:{$in:["$$this.status",[1,2,3,4,5]]},
                                            then:{$add: [ "$$value", "$$this.totalCount"] },
                                            else:{$add: [ "$$value", 0] }
                                        }
                                   }
                                }
                            },
                            pendingOrders:{
                                $reduce: {
                                   input: "$data",
                                   initialValue: 0,
                                   in: {
                                        $cond:{
                                            if:{$in:["$$this.status",[0]]},
                                            then:{$add: [ "$$value", "$$this.totalCount"] },
                                            else:{$add: [ "$$value", 0] }
                                        }
                                   }
                                }
                            },
                            refundOrders:{
                                $reduce: {
                                   input: "$data",
                                   initialValue: 0,
                                   in: {
                                        $cond:{
                                            if:{$in:["$$this.status",[7]]},
                                            then:{$add: [ "$$value", "$$this.totalCount"] },
                                            else:{$add: [ "$$value", 0] }
                                        }
                                   }
                                }
                            }
                        }
                    }
                ])

                const [allOrderAmount] = await Order.aggregate([
                    {
                        $match:{
                            $expr:{
                                $and:[
                                    { $ne: [ "$status", 8 ] }
                                ]
                            }
                        }
                    },
                    {
                        $group:{
                            _id:null,
                            totalEarning:{ $sum: {$toDouble:"$totalPrice" } }
                        }
                    }
                ])
                
                responseData={
                    data:{
                        statusCode:200,
                        message:'success',
                        data:{
                            userCount,
                            topSellingStores,
                            monthlyOrders,
                            allOrderAmount,
                            topBuyers  
                        }
                    },
                    code:200
                }
                return successResponse(req,res,responseData)
            } catch (error) {
                console.log("dashboard error",error);
                responseData={
                    data:{
                        statusCode:500,
                        message:"Something wnet wrong",
                    },
                    code:500
                }
                return errorResponse(req,res,responseData)
            }
        }
    /* dashboard data end */ 


/* functions end */
module.exports = {list,detail,update,riderSupportList,riderSupportAdd,riderSupportUpdate,riderSupportRemove, rejectReasonList, rejectReasonAdd, rejectReasonUpdate, rejectReasonRemove, dashboardData}