const { successResponse, errorResponse, testResponse, convortToObjID } = require('../../helper');
const Income = require('../../models/Driver/incomeModel');
const RejectReason = require('../../models/Cms/rejectReasonModel');
const SupportReason = require('../../models/Cms/supportReasonModel');
const RiderSupport = require('../../models/Request/RiderSupportModel')
const OrderReject = require('../../models/Request/orderRejectModel')
const Driver = require('../../models/usersModel');
const Notification = require('../../models/notificationModel');
/* function start */
    const incomeList = async (req,res,next) => {
        let responseData = {}
        try {
            let reqData = req.body
            let authUser = req.user
            let IncomeMatchPrams = {
                driverId:authUser._id
            }
            if (reqData.startDate) {
                IncomeMatchPrams['createdAt']= Object.assign(
                    IncomeMatchPrams['createdAt']??{},
                    {
                        $gte:new Date(reqData.startDate)
                    }
                )
            }
            if (reqData.endDate) {
                let endDate = new Date(reqData.endDate)
                IncomeMatchPrams['createdAt']= Object.assign(
                    IncomeMatchPrams['createdAt']??{},
                    {
                        $lte:new Date(endDate.setDate(endDate.getDate()+1))
                    }
                )
            }
            // return testResponse(req,res,IncomeMatchPrams);
            let result = await Income.aggregate([
                {
                    $match:IncomeMatchPrams
                },
                {
                    $lookup:{
                        from:"users",
                        let:{storeID:"$storeId"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:['$_id',"$$storeID"]
                                    }
                                }      
                            },
                            {
                                $project:{
                                    _id:0,
                                    name:1,
                                    "vendor_profile.location":1,
                                    pro_image:{
                                        $cond: {
                                            if:{$ne : ["$pro_image", null]},
                                            then:{$concat:[process.env.PUBLIC_FOLDER_URL,"$pro_image"]},
                                            else:{$concat:[process.env.PUBLIC_FOLDER_URL,"placeholder-banner.png"]}
                                        }
                                    },

                                }
                            }
                        ],
                        as:"storeDetail"
                    }
                },
                {
                    $lookup:{
                        from:"orders",
                        let:{orderID:"$orderId"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:['$_id',"$$orderID"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    orderNumber:1,
                                    deliveryAddress:1,
                                    createdAt:{
                                        $dateToString:{date:"$createdAt",format:"%Y-%m-%d"}
                                    }
                                }
                            }
                        ],
                        as:"orderDetail"
                    }
                },
                {
                    $lookup:{
                        from:"reviewratings",
                        let:{ orderID:"orderId" },
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $and:[
                                            {
                                                $eq:["$orderId", "$$orderID"],
                                            },
                                            {
                                                $eq:["$type", "driver"]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project:{
                                    rating:"$rateType"
                                }
                            }
                        ],
                        as:"reviewData"
                    }
                },
                {
                    $project:{
                        earning:1,
                        tip:1,
                        storeDetail:{"$first":"$storeDetail"},
                        orderDetail:{"$first":"$orderDetail"},
                        reviewData:{
                            $cond: { 
                                if: {$ne:[{$size:"$reviewData"},0]}, 
                                then: {"$first":"$reviewData"}, 
                                else: {
                                    _id:"",
                                    rating:""
                                } 
                            } 
                        }
                    }
                }
            ])
            responseData={
                data:{
                    statusCode:200,
                    message:"Success",
                    data:{
                        totalBalance:authUser.income.total,
                        list:result
                    }
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
    const requestReasonList = async (req,res,next) => {
        let responseData = {}
        try {
            let result= []
            if (req.body.type=='support') {
                result = await SupportReason.find({status:true},{
                    _id:0,
                    label:"$title",
                    value:"$title"
                })
            }else{
                result = await RejectReason.find({status:true},{
                    _id:0,
                    label:"$title",
                    value:"$title"
                })
            }
            responseData={
                data:{
                    statusCode:200,
                    message:"Success",
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
    const supportRequest = async (req,res,next) => {
        let responseData = {}
        try {
            await new RiderSupport({
                reason:req.body.reason,
                description:req.body.reason
            }).save()
            responseData={
                data:{
                    statusCode:200,
                    message:"Success",
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
    const rejectRequest = async (req,res,next) => {
        let responseData = {}
        try {
            await new OrderReject({
                reason:req.body.reason,
                description:req.body.reason,
                orderId:req.body.orderIds
            }).save()
            responseData={
                data:{
                    statusCode:200,
                    message:"Success",
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
    /* Notification Api Start */
        const notificationList = async (req,res,next) => {
            let responseData = {}
            try {
                let result = await Notification.find({
                    userId:req.user._id
                },{
                    title:1,
                    body:1,
                    status:1
                },{
                    $sort:{
                        _id:-1
                    }
                })
                responseData={
                    data:{
                        statusCode:200,
                        message:"Success",
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
        const updateFirbaseToken = async (req,res,next)=> {
            let responseData = {}
            try {
                let reqData = req.body
                await Driver.findByIdAndUpdate(req.user._id,{$set:{
                    "driver_profile.notification.token":reqData.fireBaseToken,
                    "driver_profile.notification.type":reqData.type
                }})
                responseData={
                    data:{
                        statusCode:200,
                        message:"Success",
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
        const changeNotificationStatus = async (req,res,next) => {
            let responseData = {}
            try {
                await Driver.findByIdAndUpdate(req.user._id,{$set:{
                    "driver_profile.notification.status":req.body.status,
                }})
                responseData={
                    data:{
                        statusCode:200,
                        message:"Success",
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
    /* Notification Api End */
/* function end */
module.exports = {incomeList, requestReasonList, supportRequest, rejectRequest, notificationList, updateFirbaseToken, changeNotificationStatus}