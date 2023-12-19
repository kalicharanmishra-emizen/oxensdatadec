const { successResponse, errorResponse, testResponse, convortToObjID, calculateGeoDiatance, getDriverPrvJobData, sendEmail, xeroTokenGenrate, xeroTenantDetail, xeroOrderCreate, xeroInvoiceCreate, twilioCreateService, twilioDeleteService } = require('../../helper');
const DriverAssign = require('../../models/Order/assign/AssigingDriverModel');
const Driver = require('../../models/usersModel');
const DriverJob = require('../../models/Driver/jobModel');
const DIncomne = require('../../models/Driver/incomeModel');
const Order = require('../../models/Order/orderModel');
const Orderproducts = require("../../models/Order/productModal")
const User = require('../../models/usersModel');
const POSUser = require("../../models/posUserModel")
const Setting = require('../../models/Setting/mainSettingModel')
const Notification = require('../../models/notificationModel');
const moment = require('moment');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const pdf_file_path = path.join(__dirname,"../../public/pdf/");
// const plivo = require('plivo');
// const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require('node-thermal-printer');
// const Printer = require('node-thermal-printer');
let infobip = require('node-infobip');
// let auth = new infobip.Auth('Basic', 'Ashwin_Singh', "Asdf@123")
let auth = new infobip.Auth('App', 'addcd7be5b875050be80ed4a751278ce-9b093705-63bd-4112-b98d-a9a7600bfcab')
var https = require('follow-redirects').https;

const { orderHandler, driverJobHandler } = require('../../socket');
const { ConversionBalances } = require('xero-node');
// const config = require('../../config/config');
/* start functions */
    // driver cron only for testing 
    const driverCron = async (req, res) => {
        console.log("dirver cron job")
        try {
            const today = new Date()
            const lastDay = new Date(new Date().setDate(new Date().getDate() - 1))
            const hourago = new Date(new Date().getTime() - (2000*60*60));
            const previousTime = new Date(new Date().setSeconds(new Date().getSeconds() - 35))
            const result = await DriverAssign.aggregate([
               {
                    $match:{
                        // _id:{$not:{$in:}},
                        status :{ $ne:false },
                        try : { $lte:5 },
                        // driverIds:{$ne:[]},
                        createdAt : { $gt:hourago },
                        time : { $lt:previousTime }
                    }
               },
            ])

            console.log("result",result);
            if (result.length !== 0) {
                result.map( async (assignedDriverData) => {
                    let jobData = await DriverJob.findOne(
                        {$and:[
                            { driverId : { $in : assignedDriverData.driverIds } },
                            { orderId : assignedDriverData.orderId },
                            { status : { $eq: 0 } }
                        ]}
                    )
                    console.log("check data find one ", jobData);
                    if (jobData) {
                        const deleee = await DriverJob.findByIdAndDelete(jobData._id)
                        assignOrderToDriver(jobData.orderId)
                        console.log("deleted record --------", deleee);
                    }else{
                        if(assignedDriverData.try >= 5) {
                            console.log("assignedDriverData._id -----", assignedDriverData._id,  " try ---",assignedDriverData.try);
                            const updateAsngDriverStatus = await DriverAssign.findByIdAndUpdate(assignedDriverData._id,{$set:{status:false}},{new:true}) 
                            console.log("updateAsngDriverStatus +++++++", updateAsngDriverStatus);
                        }else{
                            assignOrderToDriver(assignedDriverData.orderId)
                        }
                    }
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
            console.log({
                title:"driver cron error",
                message:error,
                time:new Date()
            });
        }
    }

    const assignOrderToDriver = async (orderId,driversID=null) =>{
        try {
            let conOrderId = await convortToObjID(orderId)
            let data = await DriverAssign.findOne({orderId:conOrderId})
            // console.log('Order data:-', data);
            /* find and update and cerate order assignment data start */
                if (!data) {
                    data = await new DriverAssign({orderId:conOrderId,try:1}).save()
                }else{
                    if (data.status) {
                        if (data.driverIds.try===process.env.OA_RETRY_LIMIT) {
                            data.status = false
                        }else{
                            data.try=data.try+1
                        }
                        await data.save()
                    }   
                }
                console.log('status:', data.status);
            /* find and update and cerate order assignment data end */
            if (!data.status) {
                console.log({
                    title:"Order assign limit reached",
                    orderID:data.orderId,
                    time:new Date()
                });
                return false
            }else{
                let todayDate = moment().format('Y-MM-DD')
                let orderData = await Order.findById(orderId);
                console.log('order status data:', orderData);
                let filterCondition ={
                    "_id":{$nin:data.driverIds},
                    "status": true,
                    "driver_profile.online": true,
                    "driver_profile.vehicleType":{$gte:orderData.packageType},
                    "driverJobsSize" : {$eq:0},
                    "roleDataSize" : {$ne:0},
                }
                let orderCoordinats = orderData.deliveryAddress.location.coordinates || [0,0]
                let avalableDriver = await Driver.aggregate([
                    {
                        $geoNear: {
                            near: { type: "Point", coordinates: orderCoordinats},
                            distanceField: "distance",
                            key:"driver_profile.currentLocation",
                            distanceMultiplier: 0.001/1.609,
                            spherical: true
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
                                                    "$in": ["$_id", "$$role_id"]
                                                },
                                                {
                                                    "$eq": ["$name", "Driver"]
                                                },
                                            ]
                                        }
                                        
                                    }
                                },
                            ],
                            "as":"roleData"
                        }
                    },
                    {
                        $lookup:{
                            "from": "driverjobs",
                            "let": { "driverID": "$_id" },
                            "pipeline": [
                                {
                                    "$project":{
                                        storeId:1,
                                        status:1,
                                        driverId:1,
                                        createdAt:{
                                            $dateToString:{date:"$createdAt",format:"%Y-%m-%d"}
                                        },
                                    }
                                },
                                {
                                    "$match":
                                    {
                                        
                                        "$expr":
                                        {
                                            $or:[
                                                {
                                                    "$and":[
                                                        {
                                                            "$eq": ["$status", 3]
                                                        },
                                                        {
                                                            "$eq": ["$driverId", "$$driverID"]
                                                        },
                                                        {
                                                            "$eq": ["$createdAt", todayDate]
                                                        },
                                                    ],
                                                },
                                                {
                                                    "$and":[
                                                        {
                                                            "$lt": ["$status", 3]
                                                        },
                                                        {
                                                            "$ne":["$storeId",orderData.storeId]
                                                        },
                                                        {
                                                            "$eq": ["$driverId", "$$driverID"]
                                                        },
                                                        {
                                                            "$eq": ["$createdAt", todayDate]
                                                        }
                                                    ]
                                                }
                                            ] 
                                        }
                                    }
                                },
                            ],
                            "as":"driverRuningJobs"
                        }
                    },
                    {
                        $addFields : {
                            "driverJobsSize" : {$size : "$driverRuningJobs"},
                            "roleDataSize" : {$size : "$roleData"},
                        }
                    },
                    {
                        $match:filterCondition
                    },
                    {
                        $lookup:{
                            "from": "driverjobs",
                            "let": { "driverID": "$_id" },
                            "pipeline": [
                                {
                                    "$project":{
                                        storeId:1,
                                        driverId:1,
                                        status:1,
                                        createdAt:{
                                            $dateToString:{date:"$createdAt",format:"%Y-%m-%d"}
                                        },
                                    }
                                },
                                {
                                    "$match":
                                    {
                                        
                                        "$expr":
                                        {
                                            "$and":[
                                                {
                                                    "$lt": ["$status", 3]
                                                },
                                                {
                                                    "$eq": ["$driverId", "$$driverID"]
                                                },
                                                {
                                                    "$eq": ["$createdAt", todayDate]
                                                },
                                            ]
                                        }
                                        
                                    }
                                },
                            ],
                            "as":"driverJobs"
                        }
                    },
                    {
                        $project:{
                            name:1,
                            rating:"$driver_profile.rating",
                            vehicleType:"$driver_profile.vehicleType",
                            curJobs:"$driverJobs",
                            notification:"$driver_profile.notification"
                            // driverRuningJobs:1
                        }
                    }
                ])
                // return avalableDriver
                if (avalableDriver.length!=0) {
                    
                    /* filter all driver of same store id*/
                    let sameStoreDriver = avalableDriver.filter(temp=> temp.curJobs.length!=0)
                    let withoutStoreDriver =  avalableDriver.filter(temp=>temp.curJobs.length==0)
                    let findDriver = null
                    if (sameStoreDriver.length==0 && withoutStoreDriver.length!=0) {
                        findDriver = withoutStoreDriver[0]
                    }else{
                        sameStoreDriver.every(tamp=>{
                            if (tamp.curJobs.length < 3 && tamp.rating >=4) {
                                findDriver = tamp;
                                return false
                            }else if(tamp.curJobs.length < 2 && (tamp.rating < 4 && tamp.rating >=3)) {
                                findDriver = tamp;
                                return false
                            }else{
                                return true
                            }
                        })
                        if (!findDriver && withoutStoreDriver[0]) {
                            findDriver = withoutStoreDriver[0]
                        }
                    }

                    if (findDriver) {
                        // set avalable in assign driver table start
                            data.driverIds.push(findDriver?._id)
                            data.time = new Date()
                            await data.save()
                            // console.log("findDriver ids", findDriver);
                            // console.log("set driver assigned ===", data);
                        // set avalable in assign driver table end  
                        // create Diver Job
                        await new DriverJob({
                            orderId:orderData._id,
                            preJobId:null,
                            driverId:findDriver._id,
                            isFirst:true,
                            storeId:orderData.storeId
                        }).save()
                        /* Create order place log */
                            createOrderLogs(orderData._id,`Driver <b>${findDriver.name}</b> is assign to order`)
                            // Send Driver New job Socket
                            driverJobHandler({
                                type:"getJob",
                                driverId:findDriver._id,
                                storeId:orderData.storeId
                            })
                        /* send Driver New Order Push Notification Start */  
                            if (findDriver.notification.status && findDriver.notification.type!=='Null') {
                                await new Notification({
                                    userId:findDriver._id,
                                    title:"New Job Received",
                                    body:`Hello your new job #${orderData.orderNumber} has been received.`
                                }).save()
                                sendPushNotification({
                                    token:findDriver.notification.token,
                                    type:findDriver.notification.type,
                                    notification:{
                                        title:"New Job Received",
                                        body:`Hello your new job #${orderData.orderNumber} has been received.`
                                    }
                                })    
                            }                      
                        /* send Driver New Order Push Notification end */
                    }else{
                        console.log('No Driver Found');
                    }
                    return {
                        "sameStoreDriver":sameStoreDriver,
                        "withoutStoreDriver":withoutStoreDriver,
                        // "avalableDriver":avalableDriver
                    }
                    // throw new Error("no driver found");
                }else{
                    return false
                }
                // return true;
            }
        } catch (error) {
            console.log({
                title:"assignOrderToDriver",
                orderID:error,
                time:new Date()
            });
            // console.log('assignOrderToDriver',error);
            // throw new Error(error);
        }
        
    }
    const testDriverAssign = async (req,res,next)=>{

        let responseData = {}
        try {
            let response =  await assignOrderToDriver(req.body.orderId,req.body.driverId)
            console.log('response set order to driver === ',response);
            responseData={
                data:{
                    statusCode:200,
                    message:"test",
                    data:response
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
    const assignJobList = async (req,res,next)=>{
        let responseData = {}
        try {
            let estimateEaring = 0;
            let authUser = req.user
            let result = await DriverJob.aggregate([
                {
                    $match:{
                        driverId:authUser._id,
                        status:{$in:[0,1,3]}    
                    }
                },
                {
                    $lookup:{
                        from:"users",
                        let:{"id":"$storeId"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$_id","$$id"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    name:1,
                                    email:1,
                                    pro_image:{
                                        $cond:{
                                            if:{$ne : ["$pro_image", null]},
                                            then:{$concat:[process.env.PUBLIC_FOLDER_URL,"$pro_image"]},
                                            else:{$concat:[process.env.PUBLIC_FOLDER_URL,"img01.jpg"]}
                                        }
                                    },
                                    phone_no:1,
                                    address:"$vendor_profile.location",
                                    preparation_time:"$vendor_profile.preparation_time"
                                }
                            }
                        ],
                        as:'storeData'
                    }
                },
                {
                    $lookup:{
                        from:'orders',
                        let:{"id":"$orderId"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$_id","$$id"]
                                    }
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
                                                    $eq:['$_id',"$$userID"]
                                                }
                                            }
                                        },
                                        {
                                            $project:{
                                                name:1,
                                                phone_no:1,
                                                pro_image:{
                                                    $cond: {
                                                        if:{$ne : ["$pro_image", null]},
                                                        then:{$concat:[process.env.PUBLIC_FOLDER_URL,"$pro_image"]},
                                                        else:{$concat:[process.env.PUBLIC_FOLDER_URL,"user.jpg"]}
                                                    }
                                                }
                                            }
                                        }
                                    ],
                                    as:"userData"
                                }
                            },
                            {
                                $project:{
                                    deliveryAddress:1,
                                    userData:{$first:"$userData"},
                                    tip:1,
                                    status:1,
                                    twillioPhoneNumber:{ $cond: { if: "$twillioPhoneNumber", then:"$twillioPhoneNumber", else:null}},
                                    callStatus:{ $cond: { if: "$twillioPhoneNumber", then:true, else:false}},
                                    driverPDF:{ $cond: { if: "$driverPDF", then:"$driverPDF", else:null}},
                                    orderNumber:1,
                                    createDate:{
                                        $dateToString:{date:"$createdAt",format:"%H:%M"}
                                    }
                                }
                            }
                        ],
                        as:"orderData"
                    }
                },
                {
                    $project:{
                        status:1,
                        createdAt:1,
                        storeData:{$first:"$storeData"},
                        orderData:{$first:"$orderData"}
                    }
                }
            ])
            // console.log("result job ==", result);
            if (result.length > 0) {
                /* calculate diver astimate earning start */
                    let setting = await Setting.findOne({},{
                        _id:0,
                        fixDriverDistance:1,
                        minDriverPayFirst:1,
                        extraDriverPaySecond:1,
                        deliveryExtraPayUnit:1,
                        deliveryExtraPay:1
                    })
                    // set Min driver earing
                    estimateEaring = setting.minDriverPayFirst
                    // Get distance of diver last loation to store
                    let driverToStore = await calculateGeoDiatance({
                        origin:`${authUser.location.coordinates[1]},${authUser.location.coordinates[0]}`,
                        des:`${result[0].storeData.address.late||0},${result[0].storeData.address.lng||0}`
                    })   
                    let storeToUsers=[] 
                    // get distance between store to user's
                    if (result.length==1) {
                        storeToUsers = [await calculateGeoDiatance({
                            origin:`${result[0].storeData.address.late||0},${result[0].storeData.address.lng||0}`,
                            des:`${result[0].storeData.address.late||0},${result[0].storeData.address.lng||0}`,
                        })]
                    }else{
                        // get distance between store to user 1 and user 1 to user 2 on....
                        let lastStopCordinate = {
                            lat:result[0].storeData.address.late||0,
                            lng:result[0].storeData.address.lng||0
                        }
                        for (const element of result) {
                            let tempDistance = await calculateGeoDiatance(
                                {
                                    origin:`${lastStopCordinate.lat},${lastStopCordinate.lng}`,
                                    des:`${element.orderData.deliveryAddress.lat},${element.orderData.deliveryAddress.lng}`
                                }
                            ) 
                            lastStopCordinate={
                                lat:element.orderData.deliveryAddress.lat,
                                lng:element.orderData.deliveryAddress.lng
                            }
                            storeToUsers.push(tempDistance) 
                        }
                    }
                    let totalDistance = driverToStore;
                    storeToUsers.forEach(data=>totalDistance+=data)
                    if (totalDistance > setting.fixDriverDistance) {
                        // add travel distance pay
                        estimateEaring += (((totalDistance - setting.fixDriverDistance)/setting.deliveryExtraPayUnit) * setting.deliveryExtraPay) 
                    }
                    // add pay for extra order
                    estimateEaring += (result.length -1) * setting.extraDriverPaySecond
                /* calculate diver astimate earning end */    
            }
            const finalResponse = {
                storeData:result.length!=0?result[0].storeData:{},
                jobData:result,
                estimateEaring:estimateEaring
            }
            // console.log("finalResponse job ==", finalResponse);
            responseData={
                data:{
                    statusCode:200,
                    message:"Current Job list",
                    data:finalResponse
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
    const orderAccpetAndReject = async (req,res,next)=>{
        let responseData = {}
        try {
            let response =  await assignOrderToDriver(req.body.orderId)
            let reqData = req.body
            let authUser = req.user
            let result = await DriverJob.findOne({_id:reqData.jobId,driverId:authUser._id})
            // let result = await DriverJob.findOne({_id:reqData.jobId})
            if (!result) {
                responseData={
                    data:{
                        statusCode:400,
                        message:'Job not found',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData)
            }
            switch (reqData.status) {
                case 1:
                    const orderData = await Order.findOne({ _id:result.orderId });
                    if(orderData.length === 0)
                    {
                        console.log('order data not fount');
                    }
                    console.log('user id ==== ', orderData.userId);
                    const userData = await User.findOne({ _id:orderData.userId });
                    if(userData.length === 0)
                    {
                        console.log('user data not fount');
                    }

                    const driverData = await User.findOne({ _id:authUser._id });
                    if(driverData.length === 0)
                    {
                        console.log('driver data not fount');
                    }

                    // let clientMob = '+447884828201';
                    // let driverMob = '+447450324248';

                    let clientMob = '+91' + userData.phone_no.slice(-10);
                    let driverMob = '+91' + driverData.phone_no.slice(-10);
                    console.log('clientMob = '+ clientMob+ ', driverMob = '+ driverMob );
                    // let driverMob = authUser.phone_no;
                    const serviceData = await helper.twilioCreateService(clientMob, driverMob);
                    console.log('serviceId ====== ', serviceData);

                    // call masking service id update in order
                    let orderDataUpdate = await  Order.findByIdAndUpdate(orderData._id,{$set:{callMaskingSid:serviceData.serviceSid, twillioPhoneNumber:serviceData.proxyIdentifier, callStatus:true}},{new:true});
                    // console.log('order data update sid ==== ', orderDataUpdate);

                    result.status =1;
                    result.accpetLocation.lat=reqData.accpetLocation.lat
                    result.accpetLocation.lng=reqData.accpetLocation.lng
                    await result.save()
                    const assignedDriver = await Order.findByIdAndUpdate(result.orderId,
                        {
                            $set:{
                                driverAssignStatus:true,
                                driverAssign:result.driverId
                            }
                        },
                        {
                            new:true
                        }
                    )
                    if (assignedDriver) {
                        sendSMSorEMAILtoDriver({assignedDriverOrderData:assignedDriver})
                    }
                    await DriverAssign.findOneAndUpdate(
                        { orderId:result.orderId },
                        { $set:{ status:false } }
                    )
                    // console.log("assigned driver driver ====", assignedDriver);
                    /* Create order place log */
                        createOrderLogs(result.orderId,`Driver accepted the order`)
                    break;
                case 2:
                    console.log('-----------no------------');
                    result.status = 2;
                    result.save()

                    // const checkOrderTry = await DriverAssign.findOne({ orderId:result.orderId })
                    // if (checkOrderTry?.try < 5 && checkOrderTry.time ) {
                    //     await DriverAssign.findByIdAndUpdate( checkOrderTry._id, { $set:{ status:true } })
                    // }
                    /* Create order place log */
                        createOrderLogs(result.orderId,`Driver rejected the order`)
                    // re-assign order to other driver
                    assignOrderToDriver(result.orderId)
                    break;
                default:
                    break;
            }
            responseData={
                data:{
                    statusCode:200,
                    message:"Order status update",
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
    const pickupOrder = async (req,res,next)=>{
        let responseData = {}
        try {
            let reqData = req.body
            let authUser = req.user
            let orderStatus
            let jobStatus
            let jobData = await DriverJob.aggregate([
                {
                    $match:{
                        _id:await convortToObjID(reqData.jobId)
                    }
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
                                    lat:"$vendor_profile.location.late",
                                    lng:"$vendor_profile.location.lng"
                                }
                            }
                        ],
                        as:"storeData"
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
                                    "deliveryAddress.lat":"$deliveryAddress.lat",
                                    "deliveryAddress.lng":"$deliveryAddress.lng",
                                    tip:1,
                                    vendorCode:1,
                                    userCode:1,
                                    status:1
                                }
                            }
                        ],
                        as:"orderData"
                    }
                },
                {
                    $project:{
                        preJobId:1,
                        storeId:1,
                        accpetLocation:1,
                        isFirst:1,
                        status:1,
                        storeLocation:{$first:"$storeData"},
                        orderData:{$first:"$orderData"}
                    }
                }
            ]);
            jobData = jobData[0]||{}
            // console.log("jobData driver ==",jobData);
            if (!('orderData' in jobData)) {
                responseData={
                    data:{
                        statusCode:400,
                        message:'Order not found',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData)
            }
            if (Object.keys(jobData).length==0) {
                responseData={
                    data:{
                        statusCode:400,
                        message:'Order not found',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData)
            }
            // send SMS or Email to user (order is on the way) start

            // send SMS or Email to user (order is on the way) end
            if (reqData.type && reqData.type=="delivery") {
                if (jobData.orderData.userCode != reqData.code) {
                    responseData={
                        data:{
                            statusCode:400,
                            message:'Incorrect delivery code',
                        },
                        code:400
                    }
                    return errorResponse(req,res,responseData)
                }

                // Calculate Driver Income Start
                    let setting = await Setting.findOne({},{
                        _id:0,
                        fixDriverDistance:1,
                        minDriverPayFirst:1,
                        extraDriverPaySecond:1,
                        deliveryExtraPayUnit:1,
                        deliveryExtraPay:1
                    })
                    // let earing = Number(jobData.orderData.tip)
                    let earing = 0
                    let driverToStore = 0
                    let storeToUsers=[] 
                    let totalDistance = 0 
                    /* get all previous job and arrange in asc order start */
                        let prvjobData = [jobData]
                        if (jobData.preJobId) {
                            let temp = await getDriverPrvJobData(jobData.preJobId)
                            prvjobData.push(temp)
                            if (temp.preJobId) {
                                prvjobData.push(await getDriverPrvJobData(temp.preJobId))
                            }    
                        }
                        if(prvjobData.length > 1)
                            prvjobData = prvjobData.reverse()
                    /* get all previous job and arrange in asc order end */
                    /* get all distance of job start  */
                        driverToStore = await calculateGeoDiatance({
                            origin:`${prvjobData[0]['accpetLocation']['lat']},${prvjobData[0]['accpetLocation']['lng']}`,
                            des:`${prvjobData[0]['storeLocation']['lat']||0},${prvjobData[0]['storeLocation']['lng']||0}`
                        })
                        let lastStop = `${prvjobData[0]['storeLocation']['lat']||0},${prvjobData[0]['storeLocation']['lng']||0}`
                        for (const element of prvjobData) {
                            let tempDistance = await calculateGeoDiatance(
                                {
                                    origin:lastStop,
                                    des:`${element.orderData.deliveryAddress.lat},${element.orderData.deliveryAddress.lng}`
                                }
                            ) 
                            lastStop = `${element.orderData.deliveryAddress.lat||0},${element.orderData.deliveryAddress.lng||0}`
                            storeToUsers.push(tempDistance)
                        }
                        totalDistance+=driverToStore
                        storeToUsers.forEach(dis=>totalDistance+=dis)
                        if (!jobData.isFirst) {
                            // less last destance from total distance for calculate second and third order income
                            totalDistanceTemp = totalDistance - storeToUsers[storeToUsers.length-1]
                            // add pay for extra order
                            earing += setting.extraDriverPaySecond    
                            if (totalDistanceTemp > setting.fixDriverDistance) {
                                // add travel distance pay
                                earing += (((storeToUsers[storeToUsers.length-1] + storeToUsers[storeToUsers.length-2])/setting.deliveryExtraPayUnit) * setting.deliveryExtraPay)
                            }else{
                                // add travel distance pay
                                earing += (((totalDistance - setting.fixDriverDistance)/setting.deliveryExtraPayUnit) * setting.deliveryExtraPay)
                            }
                        }else{
                            earing += setting.minDriverPayFirst  
                            if (totalDistance > setting.fixDriverDistance) {
                                // add travel distance pay
                                earing += (((totalDistance - setting.fixDriverDistance)/setting.deliveryExtraPayUnit) * setting.deliveryExtraPay)
                            }
                        }
                    /* get all distance of job start  */
                    // Insert Driver Income Fro this order
                    new DIncomne({
                        driverId: authUser._id,
                        storeId:  jobData.storeId,
                        orderId:  jobData.orderData._id,
                        earning:  earing,
                        tip:      jobData.orderData.tip
                    }).save()
                    // Update Driver Total Income
                    await Driver.findByIdAndUpdate(authUser._id,{$inc:{'driver_profile.income.total':  (earing+ Number(jobData.orderData.tip)) }})

                    let getCallMaskingSid = await Order.findOne({_id:jobData.orderData._id});

                    const callMaskingSidDelete = helper.twilioDeleteService(getCallMaskingSid.callMaskingSid);

                    let orderDataUpdate = await  Order.findByIdAndUpdate(jobData.orderData._id,{$set:{callStatus:false}},{new:true});

                // Calculate Driver Income End
                orderStatus = 6 //after live orderStatus change 7;
                jobStatus = 4
            }else{
                if (jobData.orderData.vendorCode != reqData.code) {
                    responseData={
                        data:{
                            statusCode:400,
                            message:'Incorrect pickup code',
                        },
                        code:400
                    }
                    return errorResponse(req,res,responseData)
                }
                orderStatus = 3
                jobStatus = 3
            }
            

            //  vendor
             let storeContactData = await User.find({_id:jobData.storeId});
             console.log('vendor data: ---------- ', storeContactData[0].contact_id);
            let orderData = await  Order.findByIdAndUpdate(jobData.orderData._id,{$set:{status:orderStatus}},{new:true})
            await DriverJob.findByIdAndUpdate(reqData.jobId,{$set:{status:jobStatus}})

            /* Create order place log */
                let message = `Driver <b>${authUser.name}</b> is start delivery of order`
                if (jobStatus==4) {
                    message = `Driver <b>${authUser.name}</b> delivered the order`
                }
                createOrderLogs(orderData._id,message)     
                
            // order Status update socket
            orderHandler([
                type => 'orderStatus',
                orderData => orderData,
            ])
            responseData={
                data:{
                    statusCode:200,
                    message:"Order pickedup",
                    data:{}
                },
                code:200
            }

            let orderProduct = await Orderproducts.find({orderId:orderData._id})

            // customer conatct id
            let customerContactId = await User.find({_id:orderData.userId});
            // console.log('orderProduct data: =---------------= ', orderProduct);
            // console.log('order data: ---------- ', orderData);
            // order post on xero account
            
           //when xero software detail take from client then uncomment this xero code
            /* let clientId = process.env.XERO_CLIENT_ID;
            let clientSecret = process.env.XERO_SECRET_KEY;
            let xeroConnectTknApi = process.env.XERO_CONNECT_TOKEN_API;
            const xeroGetToken = await helper.xeroTokenGenrate(clientId, clientSecret, xeroConnectTknApi);
            // const xeroAccessToken = JSON.parse(xeroGetToken);
            console.log("Final Data get it what i got ---------------------",xeroGetToken);

            // xero get tenant id
            let xeroTenantApi = process.env.XERO_TENANT_DETAIL_API;
            const xeroGetTenantId = await helper.xeroTenantDetail(xeroGetToken, xeroTenantApi);
            console.log("get tenant id: ",xeroGetTenantId);

            // xero account order create
            let xeroOrderCreateApi = process.env.XERO_ORDER_CREATE_API;
            xeroOrderCreateData = {
                    "Contact": { "ContactID": customerContactId[0].contact_id },
                    "Date": orderData.createdAt,
                    "DeliveryDate": orderData.updatedAt,
                    "LineAmountTypes": "Exclusive",
                    "LineItems": [
                    {
                        // "ItemID": "705647f1-e675-4d63-bb29-dca862888526",
                        "Name":orderProduct[0].title,
                        // "Code":"Merino-2011-LG",
                        "Description": orderProduct[0].title + orderProduct[0].description,
                        "Quantity":  orderData.totalQuantity,
                        "UnitAmount": orderProduct[0].price
                    }
                    ],
                    // "CurrencyRate": 0.61531,
                    //  "CurrencyCode": "EUR",
                    "DeliveryAddress": orderData.deliveryAddress.address,
                    // "AttentionTo": "Bob",
                    // "Telephone": "0800 1234 5678",
                    "DeliveryInstructions": "Don't forget the code verify",
                    // "ExpectedArrivalDate": "2015-12-12"
                }
                // console.log('xero account order create: =--------= ', xeroOrderCreateData);
            let xeroOrderCreateRes = await xeroOrderCreate(xeroGetToken, xeroGetTenantId, xeroOrderCreateApi, xeroOrderCreateData);
            console.log('xero account order create: =--------= ', xeroOrderCreateRes);
            
            // create invoice
            let xeroInvcCreateApi = process.env.XERO_INVOICE_CREATE_API;      
            invoiceData = {
                "Type": "ACCREC",
                "Contact": {
                  "ContactID": customerContactId[0].contact_id
                },
                "Date": orderData.createdAt,
                "DueDate": orderData.createdAt,*/
                /*"DateString": "2009-05-27T00:00:00",
                "DueDateString": "2009-06-06T00:00:00",*/
                /*"LineAmountTypes": "Exclusive",
                "LineItems": [
                  {
                    "Description": orderProduct[0].title + orderProduct[0].description + 'order',
                    "Quantity": orderData.totalQuantity,
                    "UnitAmount":  orderProduct[0].price,
                    "AccountCode": orderData.userCode,
                    "DiscountRate": orderData.discountPrice
                  }
                ]
              }
              
            let createInvoice = await xeroInvoiceCreate(xeroInvcCreateApi, xeroGetTenantId, xeroGetToken, invoiceData);
            console.log('invoice create: =----------=', createInvoice);*/
            
            return successResponse(req,res,responseData);
        } catch(error){
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
    const chnageOrderStatus = async (req,res,next)=> {
        let responseData = {}
        try {
            let reqData = req.body
            let orderData = await Order.findById(reqData.orderId);
            let message =''
            // let jobData = await DriverJob.findById(reqData.jobId);
            if (!orderData) {
                responseData={
                    data:{
                        statusCode:400,
                        message:'Order not found',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData)
            }
            switch (reqData.status) {
                case 'onTheWay':
                    orderData.status = 4;
                    message = `Driver <b>${req.user.name}</b> is on the way`;
                    sendSMSorNotificationOnTheWay({userID:orderData.userId})
                    break;
                case 'arrived':
                    orderData.status = 5;
                    message = `Driver <b>${req.user.name}</b> arrived at destination`;
                    break;
                default:
                    responseData={
                        data:{
                            statusCode:400,
                            message:'Not a valid status',
                        },
                        code:400
                    }
                    return errorResponse(req,res,responseData)
            }
            orderData.save()

            /* Create order place log */
                createOrderLogs(orderData._id,message)  
            // order Status update socket
            orderHandler([
                type => 'orderStatus',
                orderData => orderData,
            ])
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
    const genratePDF = async ({orderID, storeData}) => {
        try {
            let authUser = storeData
            const storeDetail = await User.findById(authUser?._id)
            const result = await Order.findById(orderID)
            const userData = result.orderType === 0 ? await User.findById(result.userId) : await POSUser.findById(result.userId)
            const orderItems = await Orderproducts.find({orderId:result._id})
            const DeliveryTypes = storeDetail?.vendor_profile?.deliveryType
            // send sms or email start  ---------
            const orderObj = {
                // vender details 
                storeName:authUser ? authUser.name : "",
                // user details
                phone_no:result?.orderType === 0 ? userData?.phone_no : userData?.phoneNo,
                userName:result?.orderType === 0 ? userData?.name : userData?.firstName + " " + userData?.lastName,
                // order details 
                orderType:result ? result.type : "",
                orderNo:result ? result.orderNumber : "",
                placedDate:result ? moment(result.createdAt).format('LLL') : "",
                totalOrders:result ? result.totalQuantity : "",
                orderAddress:result ? result.deliveryAddress.address : "",
                totalMrp:result ? result.totalMrp : "NA",
                discountPrice:result ? result.discountPrice : "NA",
                orderFee:result ? result.orderFee : "NA",
                deliveryPrice:result ? result.deliveryPrice : "NA",
                servicePrice:result ? result.servicePrice : "NA",
                taxCharge:result ? result.taxCharge : "NA",
                totalPrice:result ? result.totalPrice : "NA",
                tip:result ? result.tip : "NA",
                vendorCode:result ? result.vendorCode : "",
                userCode:result ? result.userCode : "",
                comment:result ? result.comment : "",
                transectionId:result ? result.transectionId : "",
                items:orderItems ? orderItems : []
            }
            // send order Order invoice mail
            let collectionTemp = await ejs.renderFile(path.join(__basedir+'/mail-temp/oxens_collection_receipt.ejs'),orderObj)
            let venderSelfTemp = await ejs.renderFile(path.join(__basedir+'/mail-temp/vendor_own_delivery_receipt.ejs'),orderObj)
            let venderOxensTemp = await ejs.renderFile(path.join(__basedir+'/mail-temp/oxens_delivery_receipt.ejs'),orderObj)

            // Create a browser instance
            const browser = await puppeteer.launch();

            // Create a new page
            const page1 = await browser.newPage();
            const page2 = await browser.newPage();
            const page3 = await browser.newPage();
            await page1.setContent(collectionTemp, { waitUntil: 'domcontentloaded' });
            await page2.setContent(venderSelfTemp, { waitUntil: 'domcontentloaded' });
            await page3.setContent(venderOxensTemp, { waitUntil: 'domcontentloaded' });

            const collectionFileName = userData?._id.toString() + "." + result?._id.toString() + "-" + "user-receipt" + ".pdf";
            const collectionfilePath = path.join(pdf_file_path, collectionFileName);

            const venderSelfFileName = storeData?._id.toString() + "." + storeData?._id.toString() + "-" + "vender-self-receipt" + ".pdf";
            const venderSelffilePath = path.join(pdf_file_path, venderSelfFileName);

            const venderOxensFileName = storeData?._id.toString() + "." + storeData?._id.toString() + "-" + "vender-oxens-receipt" + ".pdf";
            const venderOxensfilePath = path.join(pdf_file_path, venderOxensFileName);
            
            // Downlaod the PDF
            await page1.pdf({
                path: collectionfilePath,
                margin: { top: '50px', right: '50px', bottom: '50px', left: '50px' },
                printBackground: true,
                format: 'A4',
            });

            await page2.pdf({
                path: venderSelffilePath,
                margin: { top: '50px', right: '50px', bottom: '50px', left: '50px' },
                printBackground: true,
                format: 'A4',
            });
        
            await page3.pdf({
                path: venderOxensfilePath,
                margin: { top: '50px', right: '50px', bottom: '50px', left: '50px' },
                printBackground: true,
                format: 'A4',
            });

            // await pdf.mv(filePath);
            const collectionPDF_url = process.env.BASE_URL + "public/pdf/" + collectionFileName
            const venderSelfPDF_url = process.env.BASE_URL + "public/pdf/" + venderSelfFileName
            const venderOxensPDF_url = process.env.BASE_URL + "public/pdf/" + venderOxensFileName

            // let venderCollectionMailData = {
            //     to:!authUser ? authUser?.email : "oxens@mailinator.com",
            //     // to:"oxens@mailinator.com",
            //     subject:'New Order for staff',
            //     temp:collectionTemp
            // }

            let venderMailData = {
                to:authUser ? authUser?.email : "oxens@mailinator.com",
                subject:'New Order for vendor',
                temp:DeliveryTypes === 0 ? venderOxensTemp : venderSelfTemp
            }
      
            // console.log("collectionPDF_url",collectionPDF_url );
            // console.log("venderSelfPDF_url",venderSelfPDF_url );
            // console.log("venderOxensPDF_url",venderOxensPDF_url );

            // console.log("email template data", mailData);
            // send twilio SMS notification for user or vender
            // sendSMS(
            //     `Dear Customer 
            //      The order is ready and order is on the way, 
            //      Thanks 
            //      Team Oxens`, 
            //     //  userData ? userData.phone_no : ""
            //      ""
            // )
            let message = `Dear Vender! The order is ready and order is on the way,Thanks Team Oxens`
            let number = authUser ? authUser.phone_no : ""
            // sendSMS(message, number) // send sms to vendor 
        
            // sendEmail(venderCollectionMailData) // send email to user
            sendEmail(venderMailData)  // send email to vender
            
            // Close the browser instance
            await browser.close();
            // send sms or email end  ---------

            if (result?.type === 1 || result?.orderType === 1) {
                result.collectionPDF = collectionPDF_url
            }
            if (DeliveryTypes === 0) {
                result.venderPDF = venderOxensPDF_url
            }else{
                result.venderPDF = venderSelfPDF_url
            }

            // if (result.orderType === 1) {
            //     result.venderPDF = venderOxensPDF_url
            // }else{
            //     result.venderPDF = DeliveryTypes === 0 ? venderOxensPDF_url : venderSelfPDF_url
            // }
            result.save();

        } catch (error) {
            console.log({
                title:"genratePDF error",
                orderID:error,
                time:new Date()
            });
        }
    }
    const sendSMSorEMAILtoDriver = async ({assignedDriverOrderData}) => {
        try {
            const result = await Order.findById(assignedDriverOrderData._id)
            const userData = await User.findById(result.driverAssign)
            const storeData = await User.findById(result.storeId)
            const orderItems = await Orderproducts.find({orderId:result._id})

            // send sms or email start  ---------
            const orderObj = {
                // vender details 
                storeName:storeData ? storeData.name : "",
                // user driver details
                phone_no:userData ? userData.phone_no : "",
                userName:userData ? userData.name : "",
                // order details 
                orderType:result ? result.type : "",
                orderNo:result ? result.orderNumber : "",
                placedDate:result ? moment(result.createdAt).format('LLL') : "",
                totalOrders:result ? result.totalQuantity : "",
                orderAddress:result ? result.deliveryAddress.address : "",
                totalMrp:result ? result.totalMrp : "",
                discountPrice:result ? result.discountPrice : "",
                orderFee:result ? result.orderFee : "",
                deliveryPrice:result ? result.deliveryPrice : "",
                servicePrice:result ? result.servicePrice : "",
                taxCharge:result ? result.taxCharge : "",
                totalPrice:result ? result.totalPrice : "",
                tip:result ? result.tip : "",
                vendorCode:result ? result.vendorCode : "",
                userCode:result ? result.userCode : "",
                comment:result ? result.comment : "",
                transectionId:result ? result.transectionId : "",
                items:orderItems ? orderItems : []
            }

            // send order Order invoice mail
            let driverTemp = await ejs.renderFile(path.join(__basedir+'/mail-temp/oxens_delivery_receipt.ejs'),orderObj)

            // Create a browser instance
            const browser = await puppeteer.launch();

            // Create a new page
            const page = await browser.newPage();
            await page.setContent(driverTemp, { waitUntil: 'domcontentloaded' });

            const driverFileName = userData._id.toString() + "." + result._id.toString() + "-" + "driver-receipt" + ".pdf";
            const driverfilePath = path.join(pdf_file_path, driverFileName);
            
            // Downlaod the PDF
            await page.pdf({
                path: driverfilePath,
                margin: { top: '50px', right: '50px', bottom: '50px', left: '50px' },
                printBackground: true,
                format: 'A4',
            });

            // await pdf.mv(filePath);
            const driveerPDF_url = process.env.BASE_URL + "public/pdf/" + driverFileName
            let message = `Dear Customer! The order is ready and order is on the way, Thanks Team Oxens`
            let number = userData ? userData.phone_no : ""
            let driverMailData = {
                to:userData ? userData?.email : "oxens@mailinator.com",
                subject:'New Order',
                temp:driverTemp
            }

            // sendSMS(message, number) //remove after live the code.
            sendEmail(driverMailData)

            // Close the browser instance
            await browser.close();
            // send sms or email end  ---------

            result.driverPDF = driveerPDF_url
            result.save();
        } catch (error) {
            console.log({
                title:"genratePDF to deriver error",
                message:error,
                time:new Date()
            });
        }
    }
    const sendSMSorEMAILtovender = async ({storeId}) => {
        try {
            const storeData = await User.findById(storeId)
            if (storeData) {
                let message = "Dear Customer The order is ready and order is on the way, Thanks Team Oxens"; 
                let number = storeData ? storeData.phone_no : ""
                let userMailData = {
                    to:storeData ? storeData?.email : "oxens@mailinator.com",
                    subject:'new order',
                    temp:`<p>Dear Customer The order is ready and order is on the way, Thanks Team Oxens</p>`
                }
                sendSMS(message, number)
                sendEmail(userMailData)
            }
        } catch (error) {
            console.log({
                title:"send email or sms to vendor error",
                message:error,
                time:new Date()
            });
        }
    }
    const sendSMSorNotificationOnTheWay = async ({userID}) => {
        try {
            const userData = await User.findById(userID)
            if (userData) {
                let message = `Dear Customer The order is ready and order is on the way, Thanks Team Oxens`;
                let number = userData ? userData.phone_no : "";
                let userMailData = {
                    to:userData ? userData?.email : "oxens@mailinator.com",
                    subject:'order is on the way',
                    temp:`<p>Dear Customer The order is ready and order is on the way, Thanks Team Oxens</p>`
                }
                sendSMS(message, number)
                sendEmail(userMailData)
            }
            return true
        } catch (error) {
            console.log("driver on the way notification error", error);
        }
    }
    const callHandler = async (req, res) => {
       /* try {
            const fromNumber = req.query.From;
            const toNumber = req.query.To;
            console.log("plivo fromNumber, toNumber === ", fromNumber, toNumber);
            const response = plivo.Response();
            const customerPhoneMapping = config.customerAgentMap;
            const agentCustomerMapping = Object.fromEntries(
                Object.entries(customerPhoneMapping).map((v) => v.reverse())
            );
            console.log("response plivo", agentCustomerMapping);
            if (fromNumber in customerPhoneMapping) {
                // Check whether the customer's number is in the customer-agent mapping
                const number = customerPhoneMapping[fromNumber]; // Assign the value from the customer-agent array to number variable
                const params = {
                callerId: toNumber, // Plivo number is used as the caller ID for the call toward the agent
                };
                const dial = response.addDial(params);
                const destNumber = number;
                dial.addNumber(destNumber);
                res.send(response.toXML());
            } else if (fromNumber in agentCustomerMapping) {
                // Check whether the agent's number is in the customer-agent mapping
                const number = agentCustomerMapping[fromNumber]; // Assign the key from the customer-agent array to number variable
                const params = {
                callerId: toNumber, // Plivo number is used as the caller ID for the call toward the customer
                };
                const dial = response.addDial(params);
                const destNumber = number;
                dial.addNumber(destNumber);
                res.send(response.toXML());
            }
        } catch (error) {
            console.log("call handler error", error);
        }*/
    }

    // working thermal printer start 
    const infobipCalll = async (req, res) => {
        try {

            console.log("endpoint url  qg2ywq.api.infobip.com");




//             let data = {
//                 "token": "7e623bf02cfa3aabd96bd796149aba10",
//                 "note": null,
//                 "attributes": {},
//                 "original_total_price": 8000,
//                 "total_price": 8000,
//                 "total_discount": 0,
//                 "total_weight": 10000,
//                 "item_count": 1,
//                 "items": [
//                     {
//                         "id": 45018466550066,
//                         "properties": {
//                             "Personalized Necklace - SKU": "887746828873",
//                             "_Select Font Style": "Avenir Black",
//                             "_Select Charm": "Pavé Cubic Zirconia Heart",
//                             "Personalized Name": "tesserr",
//                             "_image": "https://storage.googleapis.com/custom-product-builder/74254647602/orders/new-sovtech-8294201164082-9lluSJLxUFkWi47rRUEudzfy.png"
//                         },
//                         "quantity": 1,
//                         "variant_id": 45018466550066,
//                         "key": "45018466550066:b9150df695e4f70ccdf7f56a36a41c19",
//                         "title": "Copy Of Personalized Necklace with Pavé Cubic Zirconia Charm - Gold - Necklace / Charm",
//                         "price": 8000,
//                         "original_price": 8000,
//                         "discounted_price": 8000,
//                         "line_price": 8000,
//                         "original_line_price": 8000,
//                         "total_discount": 0,
//                         "discounts": [],
//                         "sku": "887746828871",
//                         "grams": 10000,
//                         "vendor": "new sovtech",
//                         "taxable": true,
//                         "product_id": 8294201164082,
//                         "product_has_only_default_variant": false,
//                         "gift_card": false,
//                         "final_price": 8000,
//                         "final_line_price": 8000,
//                         "url": "/products/copy-of-personalized-necklace-with-pave-cubic-zirconia-charm-gold?variant=45018466550066",
//                         "featured_image": {
//                             "aspect_ratio": 0.747,
//                             "alt": "Copy Of Personalized Necklace with Pavé Cubic Zirconia Charm - Gold",
//                             "height": 1606,
//                             "url": "https://cdn.shopify.com/s/files/1/0742/5464/7602/products/8b9dc2d28184ac32b233eb6e100cba11.jpg?v=1681471907",
//                             "width": 1200
//                         },
//                         "image": "https://cdn.shopify.com/s/files/1/0742/5464/7602/products/8b9dc2d28184ac32b233eb6e100cba11.jpg?v=1681471907",
//                         "handle": "copy-of-personalized-necklace-with-pave-cubic-zirconia-charm-gold",
//                         "requires_shipping": true,
//                         "product_type": "cpb_product",
//                         "product_title": "Copy Of Personalized Necklace with Pavé Cubic Zirconia Charm - Gold",
//                         "product_description": "Personalized Necklace with Pavé Cubic Zirconia Charm - Gold",
//                         "variant_title": "Necklace / Charm",
//                         "variant_options": [
//                             "Necklace",
//                             "Charm"
//                         ],
//                         "options_with_values": [
//                             {
//                                 "name": "Font",
//                                 "value": "Necklace"
//                             },
//                             {
//                                 "name": "Charm",
//                                 "value": "Charm"
//                             }
//                         ],
//                         "line_level_discount_allocations": [],
//                         "line_level_total_discount": 0,
//                         "quantity_rule": {
//                             "min": 1,
//                             "max": null,
//                             "increment": 1
//                         }
//                     }
//                 ],
//                 "requires_shipping": true,
//                 "currency": "ZAR",
//                 "items_subtotal_price": 8000,
//                 "cart_level_discount_applications": []
//             }


//             let item = data.items

//             for



//             let myArray = [
//                 {
//                     name: "sss",    
//                     address: "addresss",    
//                     boolean: "true",    
//                 }
//             ]

//             let temparr = []

//             let obj = myArray[0]

//             Object.entries(obj).find(([key, value]) => {


//                 if (key === "address") {
//                     temparr[key] = value
//                 }


//                 //   console.log("key 1",key, "value 1", value);
//               });


// console.log("temparr",temparr);


            // for (const [i, value] of myArray.entries()) {
            //     console.log('%d: %s', i, value);
            // }


            // twilio call start 

            // var options = {
            //     'method': 'GET',
            //     'hostname': 'qg2ywq.api.infobip.com',
            //     'path': '/calls/1/calls?type=PHONE&applicationId=01b06592152e08646b08c056&from=null&to=null&direction=OUTBOUND&status=FINISHED&startTimeAfter=2022-05-01T14:25:45.125+0000&conferenceId=066675c6-0db6-0db9-b032-031964d09af4&dialogId=066675c6-0db6-0db9-b032-031964d09af4',
            //     'headers': {
            //         'Authorization': '{authorization}',
            //         'Accept': 'application/json'
            //     },
            //     'maxRedirects': 20
            // };

            // var req = https.request(options, function (res) {
            //     var chunks = [];

            //     res.on("data", function (chunk) {
            //         chunks.push(chunk);
            //     });

            //     res.on("end", function (chunk) {
            //         var body = Buffer.concat(chunks);
            //         console.log(body.toString());
            //     });

            //     res.on("error", function (error) {
            //         console.error(error);
            //     });
            // });

            // req.end();


            // twiliow call end 


            // CLIENT_ID=E296854F11AC4370832CD0E82388DF26
            // CLIENT_SECRET=wIrtBDzJ4CQxzfU5sy9A_gMvLDcjGqiBV9wRHQ7m4GfEtbxQ
            // REDIRECT_URI=https://oxens.ezxdemo.com/


            // console.log("infobip called infobip", auth);

            //Instantiate SMS module. Specify Sender ID and Base URL
            // let sms = new infobip.SMS('Oxens', 'https://qg2ywq.api.infobip.com');

            // console.log("sms", sms);
            // Authorize SMS service
            // sms.authorize(auth);

            // Send single text
            // let msg1 = await sms.single('919950248270', 'Hello there!');
            // let msg3 = await sms.single('919950248270', 'Hello there!');
            // let msg4 = await sms.single('919950248270', 'Hello there!');

            // console.log("msg1", msg1);
            // console.log("msg3", msg3);
            // console.log("msg4", msg4);
            // let msg2 = await sms.single('919950248270', 'Hello there!', 'MyCompany');

            // console.log("msg2", msg2);



            // console.log("https", https);

            // var options = {
            //     'method': 'POST',
            //     'hostname': 'qg2ywq.api.infobip.com',
            //     'path': '/sms/2/text/advanced',
            //     'headers': {
            //         'Authorization': 'Basic addcd7be5b875050be80ed4a751278ce-9b093705-63bd-4112-b98d-a9a7600bfcab',
            //         'Content-Type': 'application/json',
            //         'Accept': 'application/json'
            //     },
            //     'maxRedirects': 20
            // };

            // console.log("options", options);
            // var req = https.request(options, function (res) {
            //     var chunks = [];

            //     res.on("data", function (chunk) {
            //         chunks.push(chunk);
            //     });

            //     res.on("end", function (chunk) {
            //         var body = Buffer.concat(chunks);
            //         console.log(body.toString());
            //     });

            //     res.on("error", function (error) {
            //         console.error(error);
            //     });
            // });

            // var postData = JSON.stringify({
            //     "messages": [
            //         {
            //             "destinations": [
            //                 {
            //                     "to": "8290044522"
            //                 }
            //             ],
            //             "from": "InfoSMS",
            //             "text": "This is a sample message"
            //         }
            //     ]
            // });

            // req.write(postData);

            // req.end();

            // console.log("postData",postData);

            // console.log(await infobip.status())
            return res.status(200).json({
                message : "success",
                status : 200,
                data : "msg1"
            })
        } catch (error) {
            console.log("infobip error", error);
            return false
        }
    } 
    // working thermal printer end

/* end functions */
module.exports = { 
    driverCron,
    assignOrderToDriver,
    testDriverAssign,
    assignJobList,
    orderAccpetAndReject,
    pickupOrder, 
    chnageOrderStatus, 
    genratePDF, 
    sendSMSorEMAILtoDriver, 
    sendSMSorEMAILtovender, 
    callHandler, 
    infobipCalll 
}