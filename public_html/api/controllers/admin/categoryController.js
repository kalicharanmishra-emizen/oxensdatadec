const CategoryType = require('../../models/categoryTypeModel');
const Category = require('../../models/categoryModel');
const { successResponse, errorResponse, testResponse } = require('../../helper');
/* functions of category types start */
    const addType = async (req,res,next) => {
        let responseData={};
        try {
            let reqData=req.body;
            /* get role and asign to user */
            const categoryType = new CategoryType({
                title:reqData.title,
            });
            let result =await categoryType.save();
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
    const listType = async (req,res,next) => {
        let responseData = {}
        try {
            let result = await CategoryType.find({}).select('title')
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
    
/* functions of category types end */
/* functions of category start */
    const categoryList = async (req,res,next) => {
        let responseData={}
        try {
            let result = await Category.find(
                {}
            )
            .select('title type status createdAt')
            .sort({'createdAt':-1})
            .populate('type','title status')
            responseData = {
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
    const categoryCreate = async (req,res,next) => {
        let responseData={}
        try {
            let reqData = req.body
            let category = new Category({
                title:reqData.title,
                type:reqData.type
            }) 
            let result = await category.save()
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
    const categoryDetail = async (req,res,next) => {
        let responseData = {}
        try {
            let categoryId = req.body.categoryId
            let result = await Category.findById(categoryId)
            responseData={
                data:{
                    statusCode:200,
                    message:'success',
                    data:result
                },
                code:200
            }
            return successResponse(req,res,responseData)
        } catch (e) {
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
    const categoryUpdate = async (req,res,next) => {
        let responseData={}
        try {
            let reqData = req.body
            let result = await Category.findOneAndUpdate({_id:reqData.categoryId},{title:reqData.title},{new:true})
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
    const ctegoryDelete = async (req,res,next) => {
        let responseData = {}
        try {
            let result = await Category.aggregate([
                {
                    $match:{
                        _id:await convortToObjID(req.body.catId),
                    }
                },
                {
                    $lookup:{
                        'from':'users',
                        'let':{"catId":"$_id"},
                        'pipeline':[
                            {
                                "$match":{
                                    "$expr":{
                                        "$in":[
                                            "$$catId","$vendor_profile.category"
                                        ]
                                    }
                                }
                            }
                        ],
                        'as':'catUser'
                    }
                }
            ])
            if (result.length==0) {
                responseData={
                    data:{
                        statusCode:400,
                        message:'No record found',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData)
            }
            if (result[0].catUser.length!=0) {
                responseData={
                    data:{
                        statusCode:400,
                        message:'You cannot delete this category because it is allready assign to a vendor',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData)
            }
            await Category.findByIdAndDelete(result[0]._id)
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
/* functions of category end */
module.exports = {addType,listType,categoryList,categoryCreate,categoryDetail,categoryUpdate, ctegoryDelete}