const Store = require("../../models/usersModel");
const AdminSettings = require("../../models/Setting/mainSettingModel")
const CatType = require('../../models/categoryTypeModel');
const Items = require('../../models/MenuItemsModel');
const { successResponse, errorResponse, testResponse, convortToObjID } = require('../../helper');
const moment = require('moment');
const ReviewRateingModel = require("../../models/reviewRateingModel");
/* function start */
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
    const listing = async (req,res,next) => {
        // return testResponse(req,res,'hello')
        let responseData={}
        try {
            let reqData = req.body

            const adminMainSettings = await AdminSettings.find()
            const dis = adminMainSettings[0].deliveryDis

            let filterCondition ={
                "roleDataSize" : {$ne:0},
                "productSize" : {$ne:0},
                "categoryCount" : {$ne:0},
                "status":true,
                "vendor_profile.typeOf":await convortToObjID(reqData.typeOf)
            }
            if (reqData.category.length!=0) {
                let tempArray=[]
                await reqData.category.map(async (data)=>{
                    tempArray.push(await convortToObjID(data))
                })
                filterCondition['vendor_profile.category']={
                    $in: tempArray
                }
            }
            let curPage = req.query.page || '1'
            let rowResult = Store.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [Number(reqData.lng || 0),Number(reqData.lat || 0)] },
                        distanceField: "distance",
                        key:"vendor_profile.location.location",
                        distanceMultiplier: 0.001/1.609,
                        spherical: true,
                        maxDistance:(dis ? dis : 50)*1000
                    }
                },
                {
                    $lookup:{
                        from: "roles",
                        let: { "role_id": "$role" },
                        pipeline: [
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
                        ],
                        as:"roleData"
                    }
                },
                {
                    $lookup:{
                        from:"categories",
                        let:{"categortIds":"$vendor_profile.category"},
                        pipeline:[
                            {
                                "$match":{
                                    "$expr":{
                                        "$in": ["$_id", "$$categortIds"]
                                    }
                                    
                                }
                            },
                            {
                                "$project":{
                                    "title":1
                                }
                            }
                        ],
                        as:"categoriesList"
                    }
                },
                {
                    $lookup:{
                        from:"menuitems",
                        let:{vendorID:"$_id"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$vendorId","$$vendorID"]
                                    }
                                }
                            }
                        ],
                        as:"productList"
                    }  
                },
                {
                    $lookup:{
                        from:"discounts",
                        let:{storeID:"$_id"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$storeId","$$storeID"]
                                    }
                                }
                            }
                        ],
                        as:"discountList"
                    }  
                },
                {
                    $lookup:{
                        from:"reviewratings",
                        let:{storeID:"$_id"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$storeId", "$$storeID"]
                                    }
                                }
                            }
                        ],
                        as:"ratingData"
                    }
                },
                {
                    $addFields : {
                        roleDataSize:{$size : "$roleData"},
                        productSize:{$size:"$productList"},
                        categoryCount:{$size:"$categoriesList"},
                        discountCount:{$size:"$discountList"}
                    }
                },
                {
                    $match:filterCondition
                },
                {
                    $project:{
                        name:1,
                        "pro_image": {
                            $cond: {
                                if:{$ne : ["$pro_image", null]},
                                then:{$concat:[process.env.PUBLIC_FOLDER_URL,"$pro_image"]},
                                else:{$concat:[process.env.PUBLIC_FOLDER_URL,"list-img.png"]}
                            }
                        },
                        "discount":{
                            $cond: {
                                if:{$ne : ["$discountCount", 0]},
                                then:{$first:"$discountList"},
                                else:{}
                            }
                        },
                        "categorys":"$categoriesList",
                        distance:1,
                        location:"$vendor_profile.location.location",
                        // badge:"$productList.badge",
                        storeRating:{
                            avg:{ $trunc:[{$avg: "$ratingData.rateType"},1]},
                            count:{ $size: "$ratingData" },
                            data:"$ratingData"
                        },
                    }
                }
            ]);
            let result = await Store.aggregatePaginate(rowResult,{page:curPage,limit: 16})
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
                        _id:await convortToObjID(req.body.storeId)
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
        let responseData = {}

        try {
            let curPage = req.query.page || '1'
            let resultRow = Items.aggregate([
                {
                    $match:{
                        vendorId:await convortToObjID(req.body.storeId),
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
/* function End */

module.exports = { filterList, listing, details, productList, storerating }