const { successResponse, errorResponse, testResponse, convortToObjID, getAutoIncrementValue} = require('../../helper');
const ReviewRateingModel = require('../../models/reviewRateingModel');
const Store = require("../../models/usersModel");
const CatType = require('../../models/categoryTypeModel');
const Items = require('../../models/MenuItemsModel');
const Setting = require("../../models/Setting/mainSettingModel")
const moment = require('moment');
const Order = require("../../models/Order/orderModel")
const OrderProduct = require("../../models/Order/productModal")
const POSuserModel = require("../../models/posUserModel");
const { genratePDF } = require('../driver/orderController');
const HelpModel = require('../../models/HelpModel');
const { default: mongoose } = require('mongoose');
/* function start */
    const orderAllCharge = async (req,res,next) =>{
        let responseData = {}
        try {
            let result = await Setting.findOne({},{
                _id:0,
                serviceFee:1,
                maxServiceFee:1,
                minDeliveryCharge:1,
                deliveryDistance:1,
                deliveryExtraFeeUnit:1,
                fixLimitDeliveryDistance:1,
                deliveryExtraFee:1,
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

    const filterList = async (req,res,next) => {
        let responseData={}
        try {
            let result = await CatType.aggregate([
                {
                    $lookup:{
                        from:'categories',
                        localField:"_id",
                        foreignField:"type",
                        as:'category'
                    }
                },
                {
                    $project:{
                        title:1,
                        "category._id":1,
                        "category.title":1,
                    }
                }
            ])
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

    const details = async (req,res,next) => {
        let responseData = {}
        let curDay = moment().format('dddd').toLowerCase()
        try {
            let result = await Store.aggregate([
                {
                    $match:{
                        _id:await convortToObjID(req.user._id)
                    }
                },
                {
                    $lookup:{
                        from:'vendorimages',
                        let:{'storeId':"$_id"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$vendorId","$$storeId"]
                                    }
                                }
                            },
                            {
                                $group:{
                                    _id:"$img_type",
                                    image:{
                                        $push:{
                                            $concat:[process.env.PUBLIC_FOLDER_URL,"$image"]
                                        }
                                    }
                                }
                            }
                        ], 
                        as:'store_image'
                    }
                },
                {
                    $lookup:{
                        from:'vendortimings',
                        let:{'storeId':"$_id"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$vendorId","$$storeId"]
                                    }
                                }
                            },
                            {
                                $project: {
                                    time_data: "$timing."+curDay
                                }
                            }
                            
                        ],
                        as:'timing'
                    }
                },
                {
                    $lookup:{
                        from:'menucategories',
                        let:{'storeId':"$_id"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $and:[
                                            {
                                                $eq:["$vendorId","$$storeId"]
                                            },
                                            {
                                                $eq:["$status",true]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $lookup:{
                                    from:'menuitems',
                                    let:{'catId':"$_id"},
                                    pipeline:[
                                        {
                                            $match:{
                                                $expr:{
                                                    $and:[
                                                        {
                                                            $eq:["$category","$$catId"]
                                                        },
                                                        {
                                                            $eq:["$vendorId","$$storeId"]
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                    ],
                                    as:'items'
                                }
                            },
                            {
                                $project:{
                                    title:1,
                                    total:{$size:"$items"}
                                }
                            },
                            {
                                $sort:{"total":-1}
                            }
                        ],
                        as:"filter"
                    }
                },
                {
                    $lookup:{
                        "from":"discounts",
                        "localField":"_id",
                        "foreignField":"storeId",
                        "as":"discountList"
                    }  
                },
                {
                    $lookup:{
                        from:"reviewratings",
                        localField:"_id",
                        foreignField:"storeId",
                        as:"ratingDetail"
                    }        
                },
                {
                    $project:{
                        title:"$name",
                        logo:{
                            $cond: {
                                if:{$ne : ["$pro_image", null]},
                                then:{$concat:[process.env.PUBLIC_FOLDER_URL,"$pro_image"]},
                                else:null
                            }
                        },
                        phone_no:1,
                        location:"$vendor_profile.location",
                        pre_time:"$vendor_profile.preparation_time",
                        minimum_amount:"$vendor_profile.minimum_amount",
                        hygiene_url:"$vendor_profile.hygiene_url",
                        timing:{$first:"$timing"},
                        filter:1,
                        store_image:1,
                        "discount":{
                            $cond: {
                                if:{$ne : [{$size:"$discountList"}, 0]},
                                then:{$first:"$discountList"},
                                else:{}
                            }
                        },
                        // rating:{
                        //     avg:"4.2",
                        //     count:"4",
                        // },
                        rating:{
                            avg:{ $trunc:[{$avg: "$ratingDetail.rateType"},1]},
                            count:{ $size: "$ratingDetail" },
                            data:"$ratingDetail"
                        },
                        deliveryType:"$vendor_profile.deliveryType",
                        assignPOS:"$vendor_profile.assignPOS",
                    }
                }
                
            ])
            responseData={
                data:{
                    statusCode:200,
                    message:"success",
                    data:result.length!=0?result[0]:{}
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

    const productList = async (req,res,next) => {
        try {
            let responseData = {}
            let curPage = req.query.page || '1'
            let resultRow = Items.aggregate([
                {
                    $match:{
                        vendorId:await convortToObjID(req.user._id),
                        category:await convortToObjID(req.body.catId),
                        // status:true
                    }
                },
                {
                    $lookup:{
                        from:'menuitemcustomizes',
                        let:{'item':"$_id"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $and:[
                                            {
                                                $eq:["$itemId","$$item"]
                                            },
                                            {
                                                $eq:["$status",true]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $lookup:{
                                    from:'menucustomizevariants',
                                    let:{"cusId":"$_id"},
                                    pipeline:[
                                        {
                                            $match:{
                                                $expr:{
                                                    $eq:["$customizeId","$$cusId"]
                                                }
                                            }
                                        },
                                        {
                                            $project:{
                                                customizeId:0,
                                                __v:0
                                            }
                                        }
                                    ],
                                    as:'variants'
                                }
                            },
                            {
                                $project:{
                                    itemId:0,
                                    status:0,
                                    __v:0
                                }
                            }
                        ],
                        as:'customize'
                    }
                },
                {
                    $project:{
                        vendorId:1,
                        title:1,
                        description:1,
                        age_res:1,
                        image:{$concat:[process.env.PUBLIC_FOLDER_URL,"$item_img"]},
                        is_customize:1,
                        price:1,
                        status:1,
                        customize:1,
                        badge:{$cond:{if:"$badge", then:"$badge", else:"0"}},
                    }
                }
            ])
            let result = await Items.aggregatePaginate(resultRow,{page:curPage,limit: 10})
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

    const storerating = async (req, res, next) => {
        let responseData = {}
        let storeID = req.body.storeId      
        let curPage = req.query.page || 1
        try {
            let result = ReviewRateingModel.aggregate([
                {
                    $match:{
                        storeId:await convortToObjID(storeID)
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
                    $sort:{
                        _id:-1
                    }
                },
                {
                    $project:{
                        _id:1,
                        userDetail:{ 
                            $cond:{ 
                                if:{ $ne: [{ $size: "$userDetail"}, 0]}, 
                                then:{ $first: "$userDetail" }, 
                                else:{ "name": "" } 
                            }
                        },
                        rateType:1,
                        description:1,
                        createdAt:1
                    }
                }
            ])
            let finaData = await ReviewRateingModel.aggregatePaginate(result, {
                page:curPage, limit:10
            })
            responseData={
                data:{
                    statusCode:200,
                    message:"success",
                    data:finaData
                },
                code:200
            }
            return successResponse(req,res,responseData); 
        } catch (error) {
            console.log("get rating error", error);
            responseData={
                data:{
                    statusCode:500,
                    message:"Something went wrong",
                },
                code:500
            }
            return errorResponse(req,res,responseData);
        }
    }

    const reviewlist = async (req,res,next) =>{
        let responseData = {}
        try {
            let pageNo= req.query.page||1
            let authUser = req.user
            let resultRow = ReviewRateingModel.aggregate([
                {
                    $match:{
                        storeId: authUser._id
                    }
                },
                {
                    $lookup:{
                        from:'users',
                        let:{userID:"$user_id"},
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
                    $lookup:{
                        from:'orders',
                        let:{orderID:"$orderId"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$_id","$$orderID"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    _id:1,
                                    orderNumber:1
                                }
                            }
                        ],
                        as:'orderData'
                    }
                },
                {
                    $sort: { 
                        createdAt: -1
                    }       
                },
                {
                    $project:{
                        _id: 1,
                        user_id: 1,
                        orderId: 1,
                        driverId: 1,
                        storeId: 1,
                        type: 1,
                        rateType: 1,
                        description: 1,
                        createdAt: 1,
                        userData:{
                            $cond: { 
                                if: {$ne:[{$size:"$userData"},0]}, 
                                then: {"$first":"$userData"}, 
                                else: {} 
                            } 
                        },
                        orderData:{
                            $cond: { 
                                if: {$ne:[{$size:"$orderData"},0]}, 
                                then: {"$first":"$orderData"}, 
                                else: {} 
                            } 
                        }
                    }
                }
            ])
            let result = await ReviewRateingModel.aggregatePaginate(resultRow,{page:pageNo})
            responseData={
                data:{
                    statusCode:200,
                    message:'success',
                    data:result
                },
                code:200
            }
            // console.log("result", result);
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

    const helplist = async (req,res,next) =>{
        let responseData = {}
        try {
            let pageNo= req.query.page || 1
            let authUser = req.user
            let resultRow = HelpModel.aggregate([
                {
                    $match:{
                        storeId: authUser._id
                    }
                },
                {
                    $lookup:{
                        from:'users',
                        let:{userID:"$user_id"},
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
                    $lookup:{
                        from:'orders',
                        let:{orderID:"$orderId"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$_id","$$orderID"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    _id:1,
                                    orderNumber:1
                                }
                            }
                        ],
                        as:'orderData'
                    }
                },
                {
                    $sort: { 
                        createdAt: -1
                    }       
                },
                {
                    $project:{
                        _id: 1,
                        user_id: 1,
                        orderId: 1,
                        storeId: 1,
                        selectReason: 1,
                        description: 1,
                        createdAt: 1,
                        file:1,
                        imagefile:{
                            $cond:{
                                if:{ $ne: [ "$file", null ] },
                                then:{ $concat:[process.env.PUBLIC_FOLDER_URL,"$file"] },
                                else:""
                            }
                        },
                        userData:{
                            $cond: { 
                                if: {$ne:[{$size:"$userData"},0]}, 
                                then: {"$first":"$userData"}, 
                                else: {} 
                            } 
                        },
                        orderData:{
                            $cond: { 
                                if: {$ne:[{$size:"$orderData"},0]}, 
                                then: {"$first":"$orderData"}, 
                                else: {} 
                            } 
                        }
                    }
                }
            ])
            let result = await HelpModel.aggregatePaginate(resultRow,{page:pageNo})
            responseData={
                data:{
                    statusCode:200,
                    message:'success',
                    data:result
                },
                code:200
            }
            // console.log("result", result);
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

    const placeOrder = async (req,res,next) =>{
        let responseData = {}
        try {
            let reqData = req.body
            let authUser = req.user
            let productArray = []
           
            let rawOrder = {
                userId:reqData.userId,
                storeId:authUser._id,
                deliveryAddress:{
                    address:reqData.deliveryAddress.address,
                    tag:reqData.deliveryAddress.tag,
                    lat:reqData.deliveryAddress.lat,
                    lng:reqData.deliveryAddress.lng,
                    location:{
                        type:"Point",
                        coordinates:[reqData.deliveryAddress.lng||0,reqData.deliveryAddress.lat||0]
                    },
                },
                pickupData:reqData.pickupData,
                type:reqData.type,
                orderNumber:await getAutoIncrementValue('orders'),
                totalQuantity:reqData.totalQuantity,
                totalMrp:reqData.totalMrp,
                taxCharge:reqData.taxCharge,
                tip:reqData.tip,
                comment:reqData.comment,
                deliveryPrice:reqData.deliveryPrice,
                discountPrice:reqData.discountPrice,
                servicePrice:reqData.servicePrice,
                totalPrice:reqData.totalPrice,
                orderType:reqData.orderType,
                paymentMode:reqData.paymentMode,
                paymentStatus:reqData.paymentStatus,
                status:reqData.status,
                vendorCode:generateRendomCode(),
                userCode:generateRendomCode(),
                transectionIdPOS:reqData.transectionIdPOS
            }
            let order = await new Order(rawOrder).save()
            // Set Order product 
            reqData.product.forEach(proList=>{
                Object.assign(proList, {orderId: order._id});
                productArray.push(proList)
            })
            await OrderProduct.insertMany(productArray);
            genratePDF({orderID:order._id, storeData:req.user})
            /* Create order place log */
            createOrderLogs(order._id,`Order is placed by Vender ${authUser.name}`)
        
            responseData={
                data:{
                    statusCode:200,
                    message:"success",
                    data:order
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

    const posOrders = async (req, res, next) => {
        let responseData = {}
        try {
            let pageNo= req.query.page||1
            const storeData = req.user 
            const rawData = Order.aggregate([
                {
                    $match:{
                        $expr:{
                            $and:[
                                { $eq: ["$orderType", 1] },
                                { $eq: ["$storeId", storeData._id] }
                            ]
                        }
                    }
                },
                {
                    $lookup:{
                        from:"posusers", 
                        let:{ userId:"$userId" },
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $and:[
                                            {$eq: [ "$_id", "$$userId" ]}
                                        ]
                                    }
                                }
                            },
                            {
                                $project:{
                                    name:{ 
                                        $concat: [ "$firstName", " ", "$lastName" ]
                                     },
                                     phoneNo:1,
                                }
                            }
                        ],
                        as:"posUserData"
                    }
                },
                {
                    $sort: { _id:-1 }
                },
                {
                    $project:{
                        orderNumber:1,
                        totalQuantity:1,
                        totalMrp:1,
                        discountPrice:1,
                        status:1,
                        paymentMode:1,
                        createdAt:1,
                        venderPDF:{ $cond: { if: "$venderPDF", then:"$venderPDF", else:null}},
                        userData:{ 
                            $cond:{ 
                                if:{ $ne: [{ $size: "$posUserData"}, 0]}, 
                                then:{ $first: "$posUserData" }, 
                                else:{ "name": "" } 
                            }
                        },
                           
                    }
                }
            ])

            const result = await Order.aggregatePaginate(rawData, {page:pageNo,limit: 10})
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

    const detail = async (req, res, next) => {
        let responseData = {}
        try {
            const orderId = await convortToObjID(req.body.orderId)
            const [result] = await Order.aggregate([
                {
                    $match:{
                        _id:orderId
                    }
                },
                {
                   $lookup:{
                      from:"posusers",
                      let:{ userId: "$userId" },
                      pipeline:[
                        {
                            $match:{
                                $expr:{
                                    $and:[
                                        { $eq: [ "$_id", "$$userId" ] }
                                    ]
                                }
                            }
                        },
                        {
                            $project:{
                                name: { $concat: [ "$firstName", " ", "$lastName" ] },
                                phoneNo:1,
                                email:1
                            }
                        }
                      ],
                      as: "userData"
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
                        userData:{"$first":"$userData"},
                        orderProduct:1,
                        vendorCode:1,
                        orderType:1,
                        paymentMode:1,
                        // venderPDF:{ $cond: { if: "$venderPDF", then:"$venderPDF", else:null}},
                        paymentStatus:{
                            $cond:[
                                "$paymentStatus", "$paymentStatus", null
                            ]
                        },
                        userPDF:{ $cond: { if: "$userPDF", then:"$userPDF", else:null}},
                        driverPDF:{ $cond: { if: "$driverPDF", then:"$driverPDF", else:null}},
                        venderPDF:{ $cond: { if: "$venderPDF", then:"$venderPDF", else:null}},
                        collectionPDF:{ $cond: { if: "$collectionPDF", then:"$collectionPDF", else:null}},
                    }
                }
            ])

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
            console.log("error", error);
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

    const createPOSuser = async (req, res, next) => {
        let responseData = {}
        try {
            const reqData = req.body

            const existsUser = await POSuserModel.findOne(
                {email:reqData.email}, 
                {phoneNo:reqData.phoneNo}
            )

            if (existsUser) {
                responseData={
                    data:{
                        statusCode:400,
                        message:"user already exists",
                        data:{}
                    },
                    code:400
                }
                return successResponse(req,res,responseData);
            }

            const result = await new POSuserModel({
                storeId:req.user,
                firstName:reqData.firstName,
                lastName:reqData.lastName,
                email:reqData.email,
                phoneNo:reqData.phoneNo
            }).save()

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

    const searchPOSuser = async (req, res, next) => {
        let responseData = {}
        const matchQuery = {
            "result": true
        }
        try {
            const reqData = req.body
            console.log("reqData",reqData);

            const result = await POSuserModel.aggregate([
                { 
                    $addFields: { 
                        result: { 
                            $or: [
                                {
                                    $regexMatch: { input: "$phoneNo", regex: `${reqData.text}`, options:"i" } 
                                },
                            ]
                        } 
                    } 
                },
                { 
                    $match: matchQuery
                },
                { 
                    $project: {
                        "_id": 1,
                        "name":{
                            $concat:["$firstName", " ", "$lastName"]
                        },
                        "email": 1,
                        "phoneNo": 1,
                    } 
                }
            ])
            // const result = await POSuserModel.find().sort({_id:-1})
            console.log("result",result);
            responseData={
                data:{
                    statusCode:200,
                    message:"success",
                    data:reqData.text ? result : []
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
/* function end */
module.exports = { helplist, reviewlist, filterList, details, productList, storerating, orderAllCharge, placeOrder, createPOSuser, searchPOSuser, posOrders, detail }