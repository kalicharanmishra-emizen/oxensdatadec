const { successResponse, errorResponse, testResponse, convortToObjID} = require('../../helper');
const Order = require('../../models/Order/orderModel')
/* function start */
    const list = async (req,res,next) =>{
        let responseData = {}
        try {
            let pageNo= req.query.page||1
            let resultRow = Order.aggregate([
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
                                    email:1
                                }
                            }
                        ],
                        as:'userData'
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
                                }
                            }
                        ],
                        as:"posUserData"
                    }
                },
                {
                    $lookup:{
                        from:'users',
                        let:{storeID:"$storeId"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$_id","$$storeID"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    name:1,
                                    email:1
                                }
                            }
                        ],
                        as:'storeData'
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
                        paymentStatus:1,
                        createdAt:1,
                        // userData:{"$first":"$userData"},
                        userData:{
                            $cond: { 
                                if:{"$first":"$userData"}, 
                                then:{"$first":"$userData"}, 
                                else:{"$first":"$posUserData"}
                            }
                        },
                        storeData:{"$first":"$storeData"},
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
                    $match:{ _id:orderId }
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
                        let:{storeID:"$storeId"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$_id","$$storeID"]
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
                        as:'storeData'
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
                        from:"orderlogs",
                        let:{orderId:"$_id"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:['$orderId',"$$orderId"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    orderId:0,
                                    __v:0
                                }
                            }
                        ],
                        as:"logData"
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
                        discount:1,
                        orderNumber:1,
                        totalQuantity:1,
                        totalMrp:1,
                        discountPrice:1,
                        orderFee:1,
                        deliveryPrice:1,
                        servicePrice:1,
                        totalPrice:1,
                        tip:1,
                        comment:1,
                        driverAssignStatus:1,
                        status:1,
                        createdAt:1,
                        updatedAt:1,
                        userData:{
                            $cond: { 
                                if:{"$first":"$userData"}, 
                                then:{"$first":"$userData"}, 
                                else:{"$first":"$posUserData"}
                            }
                        },
                        storeData:{"$first":"$storeData"},
                        orderProduct:1,
                        logData:1,
                        ratingData: "$ratingDetails",
                        paymentStatus:1,
                        userPDF:{ $cond: { if: "$userPDF", then:"$userPDF", else:null}},
                        driverPDF:{ $cond: { if: "$driverPDF", then:"$driverPDF", else:null}},
                        venderPDF:{ $cond: { if: "$venderPDF", then:"$venderPDF", else:null}},
                        collectionPDF:{ $cond: { if: "$collectionPDF", then:"$collectionPDF", else:null}},
                        transectionIdPOS:{ $cond: { if: "$transectionIdPOS", then:"$transectionIdPOS", else:null}},
                        paymentMode:{ $cond: { if: "$paymentMode", then:"$paymentMode", else:null}},
                        // ratingData:{ 
                        //     $cond:{ 
                        //         if:{ $ne: [{ $size: "$ratingDetails"}, 0]}, 
                        //         then:{ $first: "$ratingDetails" }, 
                        //         else: "" 
                        //     }
                        // },
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
/* function end */
module.exports = {list,detail}