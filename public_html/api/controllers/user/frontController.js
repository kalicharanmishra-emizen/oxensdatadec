const { successResponse, errorResponse, testResponse } = require('../../helper');
const Contact = require('../../models/contactUsModel');
const Cms = require('../../models/cmsModel');
const Career = require('../../models/careerModel');
const Order = require("../../models/Order/orderModel")
const BecomeStore = require('../../models/becomeStoreModel');
const MenuItemsModel = require('../../models/MenuItemsModel');
/* functions start */
    const contactUs =   async (req,res,next) => {
        let responseData = {}
        try {
            let reqData = req.body
            let rawData = new Contact(reqData)
            await rawData.save();
            responseData={
                data:{
                    statusCode:200,
                    message:'Thank you for contacting to us',
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
    const cms = async (req,res,next) =>{
        let responseData = {}
        try {
            let result =  await Cms.findOne({slug:req.body.slug})
            responseData={
                data:{
                    statusCode:200,
                    message:'Thank you for contacting to us',
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
    const becomeAStore = async (req,res,next) =>{
        let responseData = {}
        try {
            let reqData = req.body;
            let rawData = new BecomeStore(reqData)
            let result = rawData.save()
            responseData={
                data:{
                    statusCode:200,
                    message:'Thank you for contacting to us',
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
    const career = async (req,res,next) =>{
        let responseData = {}
        try {
            let insertData = req.body
            insertData['resume'] = await fileUpload(req.files.resume,'career/')
            let careerRow = new Career(insertData)
            let result = careerRow.save();
            responseData={
                data:{
                    statusCode:200,
                    message:'Thank you. We will contact you shortly',
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
    const search = async (req, res) => {
        let responseData={}
        const matchQuery = {
            "result": true
        }
        try {
            const reqData = req.body
            let rawData = await MenuItemsModel.aggregate([
                {
                    $lookup:{
                        from:"users",
                        let:{vendorID:"$vendorId"},
                        pipeline:[
                            {
                                $geoNear: {
                                    near: { type: "Point", coordinates: [Number(reqData.lng || 0),Number(reqData.lat || 0)] },
                                    key:"vendor_profile.location.location",
                                    spherical: true,
                                    distanceMultiplier: 0.001/1.609,
                                    distanceField: "distance",
                                }
                            },
                            {
                                $match:{
                                    $expr:{
                                        $and:[
                                            { $eq:["$_id", "$$vendorID"] },
                                            { $lt:["$distance", 50] }
                                        ]
                                    }    
                                }
                            },
                        ],
                        as:"storeData"
                    }
                },
                {
					$match: {
						$expr: {
						    $ne: [{ $size: "$storeData" }, 0],
						},
					},
				},
                { 
                    $addFields: { 
                        storeName: { 
                            $cond:[ { $first: "$storeData.name" }, { $first: "$storeData.name" }, null ] 
                        } 
                    } 
                },
                { 
                    $addFields: { 
                        result: { 
                            $or: [
                                {
                                    $regexMatch: { input: "$title", regex: `${reqData.filter}`, options:"i" } 
                                },
                                // {
                                //     $regexMatch: { input: "$storeName", regex: `${reqData.filter}`, options:"i" } 
                                // }
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
                        "category": 1,
                        "vendorId": 1,
                        "age_res": 1,
                        "title": 1,
                        "description":1,
                        "is_customize": 1,
                        "price": 1,
                        "status": 1,
                        "item_img": {
                            $cond: {
                                if:{$ne : ["$item_img", null]},
                                then:{$concat:[process.env.PUBLIC_FOLDER_URL,"$item_img"]},
                                else:{$concat:[process.env.PUBLIC_FOLDER_URL,"list-img.png"]}
                            }
                        },
                        // "storeData":"$storeData"
                        // location:{ $cond:[{$first: "$storeData.address"}, {$first: "$storeData.address"}, null] }
                    } 
                }
            ]);
            responseData={
                data:{
                    statusCode:200,
                    message:"success",
                    data:rawData
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
    const getLatlng = async (req, res) => {
        try {
            const rawData = req.body
            const [result] = await Order.aggregate([
                {
                    $match:{
                        _id:await convortToObjID(rawData.orderId)
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
                                        $eq:["$_id", "$$storeID"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    _id:0,
                                    lat: { $toDouble: "$vendor_profile.location.late" },
                                    lng: { $toDouble: "$vendor_profile.location.lng"}
                                }
                            }
                        ],
                        as:"storeData"
                    }
                },
                {   
                    $lookup:{
                        from:"users",
                        let:{driverID:"$driverAssign"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$_id", "$$driverID"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    _id:0,
                                    lat: { $last: "$driver_profile.currentLocation.coordinates" },
                                    lng: { $first: "$driver_profile.currentLocation.coordinates"}
                                }
                            }
                        ],
                        as:"assignDriverData"
                    }
                },
                {
                    $project:{
                        userId:1,
                        storeId:1,
                        user:{
                            lat:{ $toDouble: "$deliveryAddress.lat" },
                            lng:{ $toDouble: "$deliveryAddress.lng"}
                        },
                        vender:{$first :"$storeData"},
                        driver:{
                            $cond: {
                                if: { $first :"$assignDriverData" },
                                then:{ $first :"$assignDriverData" },
                                else:{
                                    lat:0,
                                    lng:0
                                }
                            }
                        }
                    }
                }
            ])
            console.log("result", result);
            responseData={
                data:{
                    statusCode:200,
                    message:'data fetched successfully',
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
/* functions end */
module.exports = {contactUs,cms,becomeAStore,career,search, getLatlng}