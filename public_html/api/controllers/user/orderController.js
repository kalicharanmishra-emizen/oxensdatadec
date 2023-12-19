const { successResponse, errorResponse, testResponse, convortToObjID, getAutoIncrementValue, sendEmail, sendSMS } = require('../../helper');
const Order = require('../../models/Order/orderModel')
const User = require("../../models/usersModel");
const ejs = require('ejs');
const path = require('path');
const Setting = require('../../models/Setting/mainSettingModel')
const VendorSetting = require('../../models/Setting/vendorMainSettingModel')
const OrderProduct = require('../../models/Order/productModal');
const MenuItem = require('../../models/MenuItemsModel.js');
const { orderHandler } = require('../../socket');
const TransectionModel = require('../../models/Order/transectionModel');
const moment = require('moment');
const { sendSMSorEMAILtovender } = require('../driver/orderController');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_7fd40b34c071fadd2c96dd63587347442e6c3f293478418a83718e5382c31989";

/* Function start */
    const orderAllCharge = async (req,res,next) =>{
        let responseData = {}
        try {
            const rawData = req.body
            const storeDeliveryType = await User.findById(rawData?.storeId)
            const DeliveryTypes = storeDeliveryType?.vendor_profile?.deliveryType

            let oxensCharges = await Setting.findOne({},{
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

            let selfCharges = await VendorSetting.findOne({storeId:storeDeliveryType?._id},{
                _id:0,
                minDeliveryCharge:1,
                deliveryDistance:1,
                deliveryExtraFeeUnit:1,
                fixLimitDeliveryDistance:1,
                deliveryExtraFee:1,
            });

            const resultData = {
                serviceFee:oxensCharges.serviceFee,
                maxServiceFee:oxensCharges.maxServiceFee,
                minDeliveryCharge:DeliveryTypes === 0 ? oxensCharges.minDeliveryCharge : selfCharges.minDeliveryCharge ,
                deliveryDistance:DeliveryTypes === 0 ? oxensCharges.deliveryDistance : selfCharges.deliveryDistance ,
                deliveryExtraFeeUnit:DeliveryTypes === 0 ? oxensCharges.deliveryExtraFeeUnit : selfCharges.deliveryExtraFeeUnit ,
                fixLimitDeliveryDistance:DeliveryTypes === 0 ? oxensCharges.fixLimitDeliveryDistance : selfCharges.fixLimitDeliveryDistance ,
                deliveryExtraFee:DeliveryTypes === 0 ? oxensCharges.deliveryExtraFee : selfCharges.deliveryExtraFee ,
                taxPay:oxensCharges.taxPay
            }

            responseData={
                data:{
                    statusCode:200,
                    message:"success",
                    data:resultData
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
   const placeOrder = async (req,res,next) =>{
        let responseData = {}
        try {
            let reqData = req.body
            console.log('order placed: ======= ',reqData);
            let authUser = req.user
            let productArray = []
            let storeData = await User.findById(reqData.storeId)
            if (!storeData) {
                responseData={
                    data:{
                        statusCode:400,
                        message:'Order not placed',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData)
            }
            let rawOrder = {
                userId:authUser._id,
                storeId:reqData.storeId,
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
                orderType:0,
                paymentMode:0,
                paymentStatus:1, // for testing add this field after complete work then remove it 
                vendorCode:generateRendomCode(),
                userCode:generateRendomCode()
            }
            let order = await new Order(rawOrder).save();
            // console.log(" order data: ---- ", order);
            // Set Order product 
           console.log(reqData);
            reqData.product.forEach ( proList=>{
                console.log("Product order data: ---- ", proList.id);
                // let menuItemId = await MenuItem.find({_id:proList.id});
                // console.log(" Menu item data: ---- ", proList.id);
                Object.assign(proList, {orderId: order._id});
                productArray.push(proList);
            });
            await OrderProduct.insertMany(productArray);
           
            /* Create order place log */
            createOrderLogs(order._id,`Order is placed by user <b>${authUser.name}</b>`)
            // fire Order Place Socket
            orderHandler({
                type:'placeOrder',
                storeId:reqData.storeId
            })

            // stripe start 
            dataObj = {
                userID:authUser._id,
                name:authUser.name,
                email: authUser.email,
                description:reqData.comment ?? ""
            }
           const getCusData = await createStripeCus(dataObj)
    
            // Create a PaymentIntent with the order amount and currency
            const paymentIntent = await stripe.paymentIntents.create({
                amount: parseInt(reqData.totalPrice)*100,
                currency: 'gbp',
                customer: getCusData.id ?? getCusData ?? "",
                // payment_method_types: ['card'],
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            const updateOrderData = {
                transectionId:paymentIntent.id
            }
            Order.findByIdAndUpdate(order._id,{$set:updateOrderData}).exec()
    
            const stripeInstentData = {
                userId:authUser._id,
                orderId:order._id ?? null,
                transectionId:paymentIntent.id ?? null,
                paymentObject:paymentIntent ?? null
            }
            
            new TransectionModel(stripeInstentData).save()
            // stripe end 

            responseData={
                data:{
                    statusCode:200,
                    message:"success",
                    data:{
                        userId:authUser._id,
                        orderid:order._id, 
                        clientSecret: paymentIntent.client_secret,
                        userData:dataObj 
                    }
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
    const payment = async (req, res) => {

      try {
        const data = req.body;
        const authuser = req.user
        // console.log("data------------", data);

        if (!data) {
            responseData={
                data:{
                    statusCode:404,
                    message:'data not found',
                    data:{}
                },
                code:404
            }
            return errorResponse(req,res,responseData) 
        }

        const updateTransectionID = {
            paymentStatus:1
        }
        await Order.findByIdAndUpdate(data._id,{$set:updateTransectionID})

        responseData={
            data:{
                statusCode:200,
                message:"payment successfully done",
                data:{}
            },
            code:200
        }
        return successResponse(req,res,responseData);
 
      } catch (error) {
        console.log("make payment error", error);
        responseData={
            data:{
                statusCode:500,
                message:'Something went wrong',
            },
            code:500
        }
        return errorResponse(req,res,responseData)
      }
    };

    const webhook = async (req, res) => {
        try {
            // const sig = req.headers['stripe-signature'];
            const payload = req.body
            // console.log("payload -------------", payload);
            const payloadString = JSON.stringify(payload, null, 2);

            const header = stripe.webhooks.generateTestHeaderString({
                payload: payloadString,
                secret:endpointSecret,
            });

            let event = stripe.webhooks.constructEvent(payloadString, header, endpointSecret);
        
            // Handle the event
            switch (event.type) {
                case 'payment_intent.canceled':
                    const paymentIntent_canceled = event.data.object;
                    // console.log("paymentIntent_canceled", paymentIntent_canceled);
                    await Order.findOneAndUpdate({transectionId:paymentIntent_canceled.id},{$set:{paymentStatus:3}})
                    // Then define and call a function to handle the event payment_intent.canceled
                break;
                case 'payment_intent.payment_failed':
                    const paymentIntent_payment_failed = event.data.object;
                    // console.log("paymentIntent_payment_failed", paymentIntent_payment_failed);
                    await Order.findOneAndUpdate({transectionId:paymentIntent_payment_failed.id},{$set:{paymentStatus:2}})
                    // Then define and call a function to handle the event payment_intent.payment_failed
                break;
                case 'payment_intent.processing':
                    const paymentIntent_processing = event.data.object;
                    // console.log("paymentIntent_processing", paymentIntent_processing);
                    await Order.findOneAndUpdate({transectionId:paymentIntent_processing.id},{$set:{paymentStatus:0}})

                    // Then define and call a function to handle the event payment_intent.processing
                break;
                case 'payment_intent.succeeded':
                    const paymentIntent_succeeded = event.data.object;
                    console.log("paymentIntent_succeeded", paymentIntent_succeeded);
                    const data = await Order.findOneAndUpdate({transectionId:paymentIntent_succeeded.id},{$set:{paymentStatus:1}})
                    if (data) {
                        sendSMSorEMAILtovender({storeId:data.storeId})
                    }
                    // Then define and call a function to handle the event payment_intent.succeeded
                break;
                // ... handle other event types
                default:
            }

            // Return a 200 res to acknowledge receipt of the event
            res.send();
        } catch (error) {
            console.log("webhook error", error);    
        }
    }

    const myOrder = async (req,res,next) =>{
        let responseData = {}
        let authUser = req.user
        let curPage = req.query.page || '1'
        try {
            let resultRow = Order.aggregate([
                {
                    $match:{
                        userId:authUser._id
                    }
                },
                {
                    $lookup:{
                        from:'users',
                        let:{"storeID":"$storeId"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$$storeID","$_id"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    name:1,
                                    image:{
                                        $cond:{
                                            if:{$ne:["$pro_image",null]},
                                            then:{$concat:[process.env.PUBLIC_FOLDER_URL,"$pro_image"]},
                                            else:{$concat:[process.env.PUBLIC_FOLDER_URL,"placeholder-banner.png"]}
                                        }
                                    },
                                    address:"$vendor_profile.location.address"
                                }
                            }
                        ],
                        as:"storeDetail"
                    }
                },
                {
                    $lookup:{
                        from:'users',
                        let:{"driverID":"$driverAssign"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$$driverID","$_id"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    name:1,
                                    email:1,
                                    phone_no:1,
                                    image:{
                                        $cond:{
                                            if:{$ne:["$pro_image",null]},
                                            then:{$concat:[process.env.PUBLIC_FOLDER_URL,"$pro_image"]},
                                            else:{$concat:[process.env.PUBLIC_FOLDER_URL,"placeholder-banner.png"]}
                                        }
                                    },
                                }
                            }
                        ],
                        as:"driverDetail"
                    }
                },
                {
                    $lookup:{
                        from:'reviewratings',
                        let:{ orderID:"$_id"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$orderId","$$orderID"]
                                    }
                                }
                            },
                            
                        ],
                        as:"ratingDetails"
                    }
                },
                {
                    $sort:{_id:-1}
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
                        totalPrice:1,
                        driverAssignStatus:1,
                        userCode:1,
                        status:1,
                        tip:1,
                        createdAt:1,
                        deliveryDate:"$updatedAt",
                        storeDetail:{$first:"$storeDetail"},
                        driverDetail:{
                            $cond:{
                                if:{$ne:[{$size:"$driverDetail"},0]},
                                then:{$first:"$driverDetail"},
                                else:{}
                            }
                        },
                        // reviewStatus: "$ratingDetails"
                        storeReview: {
                            $cond: {
                                if:{
                                    $ne:[ { $size:{ $filter:{ input:"$ratingDetails", cond:{ $eq:["$$this.type","order"] } } } }, 0 ]
                                },
                                then:true,
                                else:false
                            }
                        },
                        driverReview: {
                            $cond: {
                                if:{
                                    $ne: [ { $size: { $filter: { input:"$ratingDetails", cond: { $eq: ["$$this.type","driver"] } } } }, 0 ]
                                },
                                then:true,
                                else:false
                            }
                        }
                    }
                }
            ]);

            let result = await Order.aggregatePaginate(resultRow,{page:curPage,limit: 10})

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
    const detail = async (req,res,next) => {
        let responseData = {}
        let authUser = req.user
        let reqData = req.body
        try {
            let result = await Order.aggregate([
                {
                    $match:{
                        _id:await convortToObjID(reqData.orderId),
                        userId:authUser._id,
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
                        from:'users',
                        let:{"storeID":"$storeId"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$$storeID","$_id"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    name:1,
                                    image:{
                                        $cond:{
                                            if:{$ne:["$pro_image",null]},
                                            then:{$concat:[process.env.PUBLIC_FOLDER_URL,"$pro_image"]},
                                            else:{$concat:[process.env.PUBLIC_FOLDER_URL,"placeholder-banner.png"]}
                                        }
                                    },
                                    address:"$vendor_profile.location.address"
                                }
                            }
                        ],
                        as:"storeDetail"
                    }
                },
                {
                    $lookup:{
                        from:'reviewratings',
                        let:{ orderID:"$_id"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$orderId","$$orderID"]
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
                        orderNumber:1,
                        totalQuantity:1,
                        totalMrp:1,
                        discountPrice:1,
                        orderFee:1,
                        deliveryPrice:1,
                        servicePrice:1,
                        totalPrice:1,
                        taxCharge:1,
                        tip:1,
                        comment:1,
                        twillioPhoneNumber:{ $cond: { if: "$twillioPhoneNumber", then:"$twillioPhoneNumber", else:null}},
                        callStatus:{ $cond: { if: "$callStatus", then:true, else:false}},
                        driverAssignStatus:1,
                        userCode:1,
                        status:1,
                        createdAt:1,
                        paymentStatus:1,
                        deliveryDate:"$updatedAt",
                        storeDetail:{$first:"$storeDetail"},
                        orderProduct:1,
                        reviewdetails: "$ratingDetails",
                        userPDF:{ $cond: { if: "$userPDF", then:"$userPDF", else:null}},
                        driverPDF:{ $cond: { if: "$driverPDF", then:"$driverPDF", else:null}},
                        venderPDF:{ $cond: { if: "$venderPDF", then:"$venderPDF", else:null}},
                        storeReview: {
                            $cond: {
                                if:{
                                    $ne:[ { $size:{ $filter:{ input:"$ratingDetails", cond:{ $eq:["$$this.type","order"] } } } }, 0 ]
                                },
                                then:true,
                                else:false
                            }
                        },
                        driverReview: {
                            $cond: {
                                if:{
                                    $ne: [ { $size: { $filter: { input:"$ratingDetails", cond: { $eq: ["$$this.type","driver"] } } } }, 0 ]
                                },
                                then:true,
                                else:false
                            }
                        }
                    }
                }
            ]);
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
    const trackingDetail = async (req,res,next) => {
        let responseData = {}
        let authUser = req.user
        let reqData = req.body
        try {
            let result = await Order.aggregate([
                {
                    $match:{
                        _id:await convortToObjID(reqData.orderId),
                        userId:authUser._id,
                    }
                },
                {
                    $lookup:{
                        from:'users',
                        let:{"storeID":"$storeId"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$$storeID","$_id"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    name:1,
                                    location:{
                                        lat:"$vendor_profile.location.late",
                                        lng:"$vendor_profile.location.lng"
                                    }
                                }
                            }
                        ],
                        as:"storeDetail"
                    }
                },
                {
                    $project:{
                        deliveryAddress:1,
                        orderNumber:1,
                        status:1,
                        storeDetail:{$first:"$storeDetail"},
                    }
                }
            ]);
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
/* Function end */

module.exports = {placeOrder,orderAllCharge,myOrder,detail,trackingDetail, payment, webhook}