const User = require('../../models/usersModel');
const { successResponse, errorResponse, testResponse } = require('../../helper');
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
                                            "$eq": ["$name", "User"]
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
                    "status":1,
                    "role":1,
                    "createdAt":1,
                    "dob":"$user_profile.dob",
                },  
            },
            
        ]);
        let userList= await User.aggregatePaginate(user,{page:req.query.page})
        responseData = {
            data: {
                statusCode: 200,
                message: "success",
                data: userList
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


/* functions end */
module.exports = { list,status }