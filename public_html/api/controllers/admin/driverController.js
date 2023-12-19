const User = require('../../models/usersModel');
const { successResponse, errorResponse, testResponse,convortToObjID } = require('../../helper');
const Income = require('../../models/Driver/incomeModel');
const Jobs = require('../../models/Driver/jobModel')
/* functions start */
const list = async (req, res, next) => {
    try {
        let user = User.aggregate([
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
                $sort: { 
                    createdAt: -1
                }       
            },
            {
                $project: {
                    "name":1,
                    "email":1,
                    "phone_no":1,
                    "status":1
                },  
            },
        ]);
        let driverList= await User.aggregatePaginate(user,{page:req.query.page})
        responseData = {
            data: {
                statusCode: 201,
                message: "success",
                data: driverList
            },
            code: 200
        }
        successResponse(req, res, responseData)
    } catch (error) {
        console.log('errro',error);
        responseData = {
            data: {
                statusCode: 500,
                message: 'Something went wrong',
            },
            code: 500
        }
        return errorResponse(req, res, responseData)
    }
}
const detail = async (req,res,next) => {
    let responseData = {}
    try {
        let result = await User.findById(req.body.driverId,{
            name:1,
            email:1,
            phone_no:1,
            status:1,
            profile:"$driver_profile"
        })
        responseData = {
            data: {
                statusCode: 200,
                message: "success",
                data: result
            },
            code: 200
        }
        successResponse(req, res, responseData)
    } catch (error) {
        console.log('errro',error);
        responseData = {
            data: {
                statusCode: 500,
                message: 'Something went wrong',
            },
            code: 500
        }
        return errorResponse(req, res, responseData)
    }
    
}
const status = async (req,res,next) => {
    let responseData = {}
    try {
        let result = await User.findOneAndUpdate({_id:req.body.userId},[{
            $set:{
                'status':{$not: "$status"}
            }
        }],{new:true})
        responseData = {
            data: {
                statusCode: 200,
                message: "success",
                data: result.status
            },
            code: 200
        }
        successResponse(req, res, responseData)
    } catch (error) {
        console.log('errro',error);
        responseData = {
            data: {
                statusCode: 500,
                message: 'Something went wrong',
            },
            code: 500
        }
        return errorResponse(req, res, responseData)
    }
}

const driverIncomeList = async (req,res,next) => {
    let responseData = {}
    try {
        let IncomeMatchPrams = {
            driverId:await convortToObjID(req.body.driverId)
        }
        if (req.body.startDate) {
            IncomeMatchPrams['createdAt']= Object.assign(
                IncomeMatchPrams['createdAt']??{},
                {
                    $gte:new Date(req.body.startDate)
                }
            )
        }
        if (req.body.endDate) {
            let endDate = new Date(req.body.endDate)
            IncomeMatchPrams['createdAt']= Object.assign(
                IncomeMatchPrams['createdAt']??{},
                {
                    $lte: new Date(endDate.setDate(endDate.getDate()+1))
                }
            )
        }
        let tempResult = Income.aggregate([
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
                $sort:{
                    _id:-1
                }
            },
            {
                $project:{
                    earning:1,
                    tip:1,
                    createdAt:1,
                    storeDetail:{"$first":"$storeDetail"},
                    orderDetail:{"$first":"$orderDetail"},
                }
            }
        ])
        let result = await Income.aggregatePaginate(tempResult,{page:req.body.page})
        responseData = {
            data: {
                statusCode: 200,
                message: "success",
                data: result
            },
            code: 200
        }
        successResponse(req, res, responseData) 
    } catch (error) {
        console.log('errro',error);
        responseData = {
            data: {
                statusCode: 500,
                message: 'Something went wrong',
            },
            code: 500
        }
        return errorResponse(req, res, responseData)
    }
}
const driverJobList = async (req,res,next) => {
    let responseData = {}
    try {
        let jobMatchPrams = {
            driverId:await convortToObjID(req.body.driverId)
        }
        if (req.body.startDate) {
            jobMatchPrams['createdAt']= Object.assign(
                jobMatchPrams['createdAt']??{},
                {
                    $gte:new Date(req.body.startDate)
                }
            )
        }
        if (req.body.endDate) {
            let endDate = new Date(req.body.endDate)
            jobMatchPrams['createdAt']= Object.assign(
                jobMatchPrams['createdAt']??{},
                {
                    $lte:new Date(endDate.setDate(endDate.getDate()+1))
                }
            )
        }
        let tempResult = Jobs.aggregate([
            {
                $match:jobMatchPrams
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
                $sort:{
                    _id:-1
                }
            },            
            {
                $project:{
                    isFirst:1,
                    status:1,
                    createdAt:1,
                    storeDetail:{"$first":"$storeDetail"},
                    orderDetail:{"$first":"$orderDetail"},
                }
            }
        ])
        let result = await Jobs.aggregatePaginate(tempResult,{page:req.body.page})
        responseData = {
            data: {
                statusCode: 200,
                message: "success",
                data: result
            },
            code: 200
        }
        successResponse(req, res, responseData) 
    } catch (error) {
        console.log('errro',error);
        responseData = {
            data: {
                statusCode: 500,
                message: 'Something went wrong',
            },
            code: 500
        }
        return errorResponse(req, res, responseData)
    }
}
/* functions end */
module.exports = { list, status, detail, driverIncomeList, driverJobList }