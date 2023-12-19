const { successResponse, errorResponse, testResponse, convortToObjID, sendEmail} = require('../../helper');
const Order = require('../../models/Order/orderModel');
const Orderproducts = require('../../models/Order/productModal');
const moment = require('moment');
const fs = require('fs');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const path = require('path');
const User = require('../../models/usersModel');
const { orderHandler } = require('../../socket');
const { assignOrderToDriver, genratePDF } = require('../driver/orderController');
const pdf_file_path = path.join(__dirname,"../../public/pdf/");
// const pdf_file_path = path.join(__dirname,"../../public/pdf",`${new Date().toISOString().replace(/:/g, '-')}receipt.pdf`)

/* function start */
    const list = async (req,res,next) =>{
        let responseData = {}
        try {
            let pageNo= req.query.page||1
            let authUser = req.user
            let resultRow = Order.aggregate([
                {
                    $match:{
                        status:{$gt:2},
                        paymentStatus:1,
                        storeId:authUser._id
                    }
                },
                {
                    $lookup:{
                        from:"posusers",
                        let:{userID:"$userId"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$_id", "$$userID"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    name:{ $concat: [ "$firstName", " ", "$lastName" ] },
                                    email:1,
                                    phone_no:"$phoneNo"
                                }
                            }
                        ],
                        as:"posUserData"
                    }
                },
                {
                    $lookup:{
                        from:'users',
                        let:{userID:"$userId"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$_id","$$userID"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    name:1,
                                    email:1,
                                }
                            }
                        ],
                        as:'userData'
                    }
                },
                {
                    $sort: { 
                        createdAt: -1
                    }       
                },
                {
                    $project:{
                        type:{
                            $cond:{
                                if:"$type",
                                then:"$type",
                                else:0
                            }
                        },
                        orderNumber:1,
                        totalQuantity:1,
                        totalMrp:1,
                        discountPrice:1,
                        status:1,
                        createdAt:1,
                        userPDF:{ $cond: { if: "$userPDF", then:"$userPDF", else:null}},
                        driverPDF:{ $cond: { if: "$driverPDF", then:"$driverPDF", else:null}},
                        venderPDF:{ $cond: { if: "$venderPDF", then:"$venderPDF", else:null}},
                        collectionPDF:{ $cond: { if: "$collectionPDF", then:"$collectionPDF", else:null}},
                        userData:{ 
                            $cond:{ 
                                if:{ "$first": "$userData" }, 
                                then:{ "$first": "$userData" }, 
                                else:{ "$first": "$posUserData" } 
                            }
                        },
                        orderType:{ $cond: { if: "$orderType", then:"$orderType", else:null}}
                       
                    }
                }
            ])
            
            let result = await Order.aggregatePaginate(resultRow,{page:pageNo})

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
    const detail= async (req,res,next) =>{
        let responseData = {}
        try {
            let orderId = await convortToObjID(req.body.orderId)
            let result = await Order.aggregate([
                {
                    $match:
                    {
                         _id:orderId
                    }
                },
                {
                    $lookup:{
                        from:"posusers",
                        let:{userID:"$userId"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$_id", "$$userID"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    name:{ $concat: [ "$firstName", " ", "$lastName" ] },
                                    email:1,
                                    phone_no:"$phoneNo"
                                }
                            }
                        ],
                        as:"posUserData"
                    }
                },
                {
                    $lookup:{
                        from:'users',
                        let:{userID:"$userId"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$_id","$$userID"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    name:1,
                                    email:1,
                                    phone_no:1
                                }
                            }
                        ],
                        as:'userData'
                    }
                },
                {
                    $lookup:{
                        from:'orderproducts',
                        let:{orderID:"$_id"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$orderId","$$orderID"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    __v:0,
                                    orderId:0
                                }
                            }
                        ],
                        as:'orderProduct'
                    }
                },
                {
                    $lookup:{
                        from:"reviewratings",
                        let:{
                            orderID: "$_id"
                        },
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $and:[
                                            {
                                                $eq:["$orderId","$$orderID"],
                                            },
                                            {
                                                $eq:["$type","order"]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $lookup:{
                                    from:"users",
                                    let:{ userId:"$user_id" },
                                    pipeline:[
                                        {
                                            $match:{
                                                $expr:{
                                                    $eq:["$_id","$$userId"]
                                                }
                                            }
                                        },
                                        {
                                            $project:{
                                                _id:0,
                                                name:1
                                            }
                                        }
                                    ],
                                    as:"userDetail"
                                }
                            },
                            {
                                $project:{
                                    user_id:1,
                                    orderId:1,
                                    type:1,
                                    rateType:1,
                                    description:1,
                                    createdAt:1,
                                    name:{ 
                                        $cond:{ 
                                            if:{ $ne: [{ $size: "$userDetail"}, 0]}, 
                                            then:{ $first: "$userDetail.name" }, 
                                            else:{ "name": "" } 
                                        }
                                    },
                                }
                            }
                        ],
                        as:"ratingDetails"
                    }
                },
                {
                    $project:{
                        type:{
                            $cond:{
                                if:"$type",
                                then:"$type",
                                else:0
                            }
                        },
                        pickupData:{
                            $cond:{
                                if:"$pickupData",
                                then:"$pickupData",
                                else:{
                                    date:'',
                                    time:''
                                }
                            }
                        },
                        deliveryAddress:1,
                        discount:1,
                        orderNumber:1,
                        totalQuantity:1,
                        totalMrp:1,
                        discountPrice:1,
                        tip:1,
                        comment:1,
                        driverAssignStatus:1,
                        status:1,
                        createdAt:1,
                        updatedAt:1,
                        userData:{
                            $cond:{
                                if:{"$first":"$userData"},
                                then:{"$first":"$userData"},
                                else:{"$first":"$posUserData"}
                            }
                        },
                        orderProduct:1,
                        vendorCode:1,
                        // venderPDF:{ $cond: { if: "$venderPDF", then:"$venderPDF", else:null}},
                        // ratingData: "$ratingDetails"
                        paymentStatus:{
                            $cond:[
                                "$paymentStatus", "$paymentStatus", null
                            ]
                        },
                        ratingData:{ 
                            $cond:{ 
                                if:{ $ne: [{ $size: "$ratingDetails"}, 0]}, 
                                then:{ $first: "$ratingDetails" }, 
                                else: {}
                            }
                        },
                        orderType:{ $cond: { if: "$orderType", then:"$orderType", else:null}},
                        userPDF:{ $cond: { if: "$userPDF", then:"$userPDF", else:null}},
                        driverPDF:{ $cond: { if: "$driverPDF", then:"$driverPDF", else:null}},
                        venderPDF:{ $cond: { if: "$venderPDF", then:"$venderPDF", else:null}},
                        collectionPDF:{ $cond: { if: "$collectionPDF", then:"$collectionPDF", else:null}},
                        transectionIdPOS:{ $cond: { if: "$transectionIdPOS", then:"$transectionIdPOS", else:null}},
                        paymentMode:{ $cond: { if: "$paymentMode", then:"$paymentMode", else:null}},
                    }
                }
            ])
            responseData={
                data:{
                    statusCode:200,
                    message:'success',
                    data:result.length!=0?result[0]:{}
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
    const activeOrderList = async (req,res,next)=>{
        let responseData = {}
        try {
            let authUser = req.user
            let result = await Order.aggregate([
                {
                    $match:{
                        status:{$lte:2},
                        storeId:authUser._id,
                        paymentStatus:1
                    }
                },
                {
                    $lookup:{
                        from:"posusers",
                        let:{userID:"$userId"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$_id", "$$userID"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    name:{$concat:[ "$firstName", " ", "$lastName" ]},
                                    email:1,
                                    phone_no:"$phoneNo"
                                }
                            }
                        ],
                        as:"posUserData"
                    }
                },
                {
                    $lookup:{
                        from:'users',
                        let:{userID:"$userId"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$_id","$$userID"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    name:1,
                                    email:1,
                                    phone_no:1
                                }
                            }
                        ],
                        as:'userData'
                    }
                },
                {
                    $lookup:{
                        from:'orderproducts',
                        let:{orderID:"$_id"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$orderId","$$orderID"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    __v:0,
                                    orderId:0
                                }
                            }
                        ],
                        as:'orderProduct'
                    }
                },
                {
                    $sort: { 
                        createdAt: -1
                    }       
                },
                {
                    $project:{
                        type:{
                            $cond:{
                                if:"$type",
                                then:"$type",
                                else:0
                            }
                        },
                        pickupData:{
                            $cond:{
                                if:"$pickupData",
                                then:"$pickupData",
                                else:{
                                    date:'',
                                    time:''
                                }
                            }
                        },
                        deliveryAddress:1,
                        discount:1,
                        orderNumber:1,
                        totalQuantity:1,
                        totalMrp:1,
                        discountPrice:1,
                        tip:1,
                        comment:1,
                        vendorCode:1,
                        driverAssignStatus:1,
                        status:1,
                        createdAt:1,
                        updatedAt:1,
                        // userData:{"$first":"$userData"},
                        userData:{
                            $cond: { 
                                if:{"$first":"$userData"}, 
                                then:{"$first":"$userData"}, 
                                else:{"$first":"$posUserData"}
                            }
                        },
                        orderProduct:1,
                        paymentStatus:1,
                        orderType:{ $cond: { if: "$orderType", then:"$orderType", else:null}},
                        userPDF:{ $cond: { if: "$userPDF", then:"$userPDF", else:null}},
                        driverPDF:{ $cond: { if: "$driverPDF", then:"$driverPDF", else:null}},
                        venderPDF:{ $cond: { if: "$venderPDF", then:"$venderPDF", else:null}},
                        collectionPDF:{ $cond: { if: "$collectionPDF", then:"$collectionPDF", else:null}},
                        transectionIdPOS:{ $cond: { if: "$transectionIdPOS", then:"$transectionIdPOS", else:null}},
                        paymentMode:{ $cond: { if: "$paymentMode", then:"$paymentMode", else:null}},
                        // paymentStatus:{
                        //     $cond:[ "$paymentStatus", "$paymentStatus", null ] 
                        // }
                    }
                }
            ])
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
    const orderStatusUpdate = async (req,res,next)=>{
        let responseData = {}
        try {
            let reqData = req.body
            const result = await Order.findById(reqData.id)

            if (result.status==0) {
                if (reqData.statusType=='accpet') {

                    result.status = 1;
                    result.packageType = reqData.packageType
                    result.save();

                    /* Create order place log */
                    createOrderLogs(result._id,`Order is accpeted by vendor`)

                    // genrate pdf on order activate 
                    genratePDF({orderID:result._id, storeData:req.user})

                    if (!result.type) {
                        /* call a function for assign a driver for background */
                        assignOrderToDriver(result._id)    
                    }
                    
                } else {
                    /* for reject or refund order */
                    result.status = 7;
                    result.save();
                    /* Create order place log */
                    createOrderLogs(result._id,`Order is cancelled by vendor`)
                }   
            }else if(result.status==1){
                result.status = 2;
                result.save();
                /* Create order place log */
                    createOrderLogs(result._id,`Order is ready to pick`)
            }else if(result.status==2){
                if(result.userCode != reqData.code){
                    responseData={
                        data:{
                            statusCode:400,
                            message:'Delivery code is wrong',
                        },
                        code:400
                    }
                    return errorResponse(req,res,responseData)
                }
                result.status=6
                result.save()
                /* Create order place log */
                createOrderLogs(result._id,`Order is picked by User`)
            }
            /* Order Status Update Socket */
            orderHandler({
                type:'orderStatus',
                orderData:result,
            })
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
/* function end */
module.exports = {list,detail,activeOrderList,orderStatusUpdate}