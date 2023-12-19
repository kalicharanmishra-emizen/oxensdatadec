const mongoose = require("mongoose");
const { successResponse, errorResponse, testResponse, convortToObjID, sendEmail, xeroTokenGenrate, xeroTenantDetail, xeroItemCreate } = require('../../helper');
const MenuCategory = require("../../models/MenuCategoryModel");
const MenuItem = require('../../models/MenuItemsModel');
const MenuItemCustomize = require('../../models/MenuItemsCustomizeModel');
const MenuCustomizeVariant = require('../../models/MenuCustomizeVariantModel')
const fs = require('fs');
const path = require('path');
const User = require("../../models/usersModel")

/* Menu category function start */
    const categoryList = async (req,res,next) => {
        let responseData = {}
        try {
            let reqData = req.body
            let result = await MenuCategory.find({vendorId:reqData.storeId}).sort({'createdAt':-1}).select('title')
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
            console.log('exp',e);
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
        let responseData = {}
        try {
            let reqData = req.body 
            let insertData = new MenuCategory(
                {
                    title:reqData.title,
                    vendorId:reqData.storeId
                }
            )
            let result = await insertData.save()
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
            console.log('exp',e);
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
            let reqData = req.body 
            let result = await MenuCategory.findById(reqData.id).select("title");
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
            console.log('exp',e);
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
        let responseData = {}
        try {
            let reqData = req.body 
            let updateData = {
                "title":reqData.title
            }
            let result = await MenuCategory.findByIdAndUpdate(reqData.id,{$set:updateData},{new:true});
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
            console.log('exp',e);
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
/* Menu category function end */
/* Menu Items function start */
    const itemList = async (req,res,next) =>{
        let responseData ={}
        try {
            let reqData = req.body
            // return testResponse(req,res,'hello');
            let resultRow = MenuItem.aggregate([
                    {
                        $match:{
                            vendorId:await convortToObjID(reqData.storeId),
                            category:await convortToObjID(reqData.category)
                        }
                    },
                    {
                        $lookup:{
                            'from':"menucategories",
                            "let":{"catId":"$category"},
                            "pipeline":[
                                {
                                    $match:{
                                        $expr:{
                                            $eq:["$_id","$$catId"]
                                        }
                                    }
                                },
                                {
                                    $project:{
                                        title:1
                                    }
                                }

                            ],
                            "as":"categorys"
                        }
                    },
                    {
                        $project:{
                            category:{"$first":"$categorys"},
                            age_res:1,
                            item_img:{
                                $cond: {
                                    if:{$ne : ["$item_img", null]},
                                    then:{$concat:[process.env.PUBLIC_FOLDER_URL,"$item_img"]},
                                    else:{$concat:[process.env.PUBLIC_FOLDER_URL,"img01.jpg"]}
                                }
                            },
                            title:1,
                            is_customize:1,
                            status:1,
                            // badge:1,
                            badge:{
                                $cond:{
                                    if:"$badge",
                                    then:"$badge",
                                    else:"",
                                }
                            },
                            aprovedByAdmin:{ $cond: [ "$aprovedByAdmin", true, false ] }
                        }
                    },
                ]
            )
        
            let result = await MenuItem.aggregatePaginate(resultRow,{page:1}) 
            // let result = await MenuItem.find({vendorId:req.user._id}).select("-__v")
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
            console.log('exp',error);
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
    const itemCreate = async (req,res,next) =>{
        let responseData ={}
        try {
            let reqData = req.body

            // xero token get
            //when xero software detail received from client then uncomment this code
         /*let clientID = process.env.XERO_CLIENT_ID;
         let clientScret = process.env.XERO_SECRET_KEY;
         let xeroConnectToknApi = process.env.XERO_CONNECT_TOKEN_API;
         const xeroTokenGet = await helper.xeroTokenGenrate(clientID, clientScret, xeroConnectToknApi);
         // const xeroAccessToken = JSON.parse(xeroTokenGet);
         console.log("Final Data get it what i got ---------------------",xeroTokenGet);
 
         // xero get tenant id
         let xeroTenantsApi = process.env.XERO_TENANT_DETAIL_API;
         const xeroGetTenantID = await helper.xeroTenantDetail(xeroTokenGet, xeroTenantsApi);
         console.log("get tenant id: ",xeroGetTenantID);
 
         // xero tenant user register
         let xeroItemCreateApi = process.env.XERO_ITEM_CREATE_API;
         data = {
                "Code": reqData.category,
                "Name": reqData.title,
                "Description": reqData.description?reqData.description:null,
                "PurchaseDescription": reqData.description?reqData.description:null,
                "PurchaseDetails": {
                    // "UnitPrice": 149,
                    "AccountCode": "300"
                },
                "SalesDetails": {
                    "UnitPrice": reqData.price?reqData.price:0.00,
                    "AccountCode": "200"
                }
            }
         console.log('item data: ', data);
         const xeroItemCreate = await helper.xeroItemCreate(xeroTokenGet, xeroGetTenantID, xeroItemCreateApi, data);
         console.log("xero item create: ",xeroItemCreate.Items[0].ItemID);*/

            const vendorDetails = await User.findById(reqData.storeId)
            // console.log('req.body',req.body,'req.files',req.files)
            // return testResponse(req,res,'hello')
            let result = await new MenuItem({
                category:reqData.category,
                vendorId:reqData.storeId,
                age_res:reqData.age_res,
                title:reqData.title,
                description:reqData.description?reqData.description:null,
                is_customize:reqData.is_customize,
                price:reqData.price?reqData.price:0.00,
                status:reqData.status,
                item_img:await fileUpload(req.files.item_img,'items/'),
                badge:reqData.badge,
                aprovedByAdmin:true,
                // item_id:xeroItemCreate.Items[0].ItemID
                item_id:''
            }).save()

            let mailData = {
                to:vendorDetails ? vendorDetails?.email : "oxens@mailinator.com",
                subject:'New item listed by admin',
                temp:`<p>hi ${vendorDetails?.name} new item (${result?.title}) listed by admin </p>`
            }
            sendEmail(mailData)

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
            console.log('exp',error);
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
    const itemDetail = async (req,res,next) =>{
        let responseData ={}
        try {
            // return testResponse(req,res,'hello detail');
            let reqData = req.body
            // console.log('new ',new MenuItem());
            let result = await MenuItem.findOne({_id:reqData.itemId})
            //  return testResponse(req,res,result)
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
            console.log('exp',error);
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
    const itemUpdate = async (req,res,next) =>{
        let responseData ={}
        try {
            // return testResponse(req,res,'hello update');
            let reqData = req.body
            let resultRow = await MenuItem.findById(reqData.itemId)
            if (!resultRow) {
                responseData={
                    data:{
                        statusCode:400,
                        message:'No Item found',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData)
            }
            resultRow.category = reqData.category
            resultRow.age_res = reqData.age_res
            resultRow.title = reqData.title
            resultRow.description = reqData.description
            resultRow.is_customize = reqData.is_customize
            resultRow.price = reqData.price?reqData.price:0
            resultRow.status = reqData.status
            resultRow.badge = reqData.badge,
            resultRow.aprovedByAdmin = reqData.status,
            resultRow.item_img = await fileUrlRemove(resultRow.item_img)
            if(req.files && 'item_img' in req.files){
                let imagePath = resultRow.item_img
                fs.unlinkSync(path.join('public',imagePath))
                resultRow.item_img = await fileUpload(req.files.item_img,'items/')
            }
            let result = await resultRow.save()

            const vendorDetails = await User.findById(resultRow?.vendorId)
            let mailData = {
                to:vendorDetails ? vendorDetails?.email : "oxens@mailinator.com",
                subject:`Item ${result?.status ? "Aproved" : "Disapproved"} By Admin`,
                temp:`<p>hi ${vendorDetails?.name} your item is (${result?.title}) ${result?.status ? "Activated" : "de-Activated"} by Admin</p>`
            }
            sendEmail(mailData)

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
            console.log('exp',error);
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
    const itemDelete = async (req,res,next) =>{
        let responseData ={}
        try {
            let resultRow = await MenuItem.findById(req.body.itemId)
            if (!resultRow) {
                responseData={
                    data:{
                        statusCode:400,
                        message:'No Item found',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData)
            }
            let imagePath = await fileUrlRemove(resultRow.item_img)
            fs.unlinkSync(path.join('public',imagePath))
            resultRow.deleteOne()
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
            console.log('exp',error);
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
    const itemStatus = async (req,res,next) => {
        let responseData ={}
        try {
            let result = await MenuItem.findOneAndUpdate({_id:req.body.itemId},[{
                $set:{
                    'status':{$not: "$status"},
                    'aprovedByAdmin':{$not: "$status"}
                }
            }],{new:true})

            const vendorDetails = await User.findById(result?.vendorId)
            let mailData = {
                to:vendorDetails ? vendorDetails?.email : "oxens@mailinator.com",
                subject:`Item ${result?.status ? "Aproved" : "Disapproved"} By Admin`,
                temp:`<p>hi ${vendorDetails?.name} your item is (${result?.title}) ${result?.status ? "Activated" : "de-Activated"} by Admin</p>`
            }
            sendEmail(mailData)

            responseData={
                data:{
                    statusCode:200,
                    message:'success',
                    data:result.status
                },
                code:200
            }
            return successResponse(req,res,responseData)
        } catch (error) {
            console.log('exp',error);
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
/* Menu Items function end */
/* Menu Items customized Start */
    const itemCustomizeList = async (req,res,next) => {
        let responseData={}
        try {
            // return testResponse(req,res,'itemCustomizeList')
            let reqData = req.body
            let result = await MenuItemCustomize.find({itemId:reqData.itemId},{"__v":0})
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
            console.log('exp',error);
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
    const itemCustomizeCreate = async (req,res,next) => {
        let responseData={}
        try {
            // return testResponse(req,res,'itemCustomizeCreate')
            let reqData = req.body 
            let insertData = MenuItemCustomize({
                itemId:reqData.itemId,
                title:reqData.title,
                is_multiple:reqData.is_multiple,
                max_multiple:reqData.max_multiple||null,
                is_dependent:reqData.is_dependent,
                dependent_with:reqData.dependent_with||null,
                status:reqData.status
            })
            let result = await insertData.save()
            responseData={
                data:{
                    statusCode:201,
                    message:'success',
                    data:result
                },
                code:201
            }
            return successResponse(req,res,responseData)
        } catch (error) {
            console.log('exp',error);
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
    const itemCustomeDetail = async (req,res,next) => {
        let responseData = {}
        try {
            let result = await MenuItemCustomize.findById(req.body.cusId)
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
            console.log('exp',error);
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
    const itemCustomizeUpdate = async (req,res,next) => {
        let responseData={}
        try {
            // return testResponse(req,res,'itemCustomizeUpdate')
            let reqData = req.body
            let resultRow = await MenuItemCustomize.findById(reqData.cusId)
            if (!resultRow) {
                responseData={
                    data:{
                        statusCode:400,
                        message:'No Item found',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData)
            }
            resultRow.title = reqData.title
            resultRow.is_multiple = reqData.is_multiple
            resultRow.max_multiple = reqData.max_multiple
            resultRow.status = reqData.status 
            let result = await resultRow.save()
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
            console.log('exp',error);
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
    const itemCustomizeDelete = async (req,res,next) => {
        let responseData={}
        try {
            // return testResponse(req,res,'itemCustomizeDelete')
            let reqData =req.body
            // let resultRow = await MenuItemCustomize.findById(reqData.cusId)
            let resultRow = await MenuItemCustomize.aggregate([
                {
                    $match:{
                        _id:mongoose.Types.ObjectId(reqData.cusId)
                    }
                },
                {
                    $lookup:{
                        'from':'menuitemcustomizes',
                        'localField':"_id",
                        'foreignField':"dependent_with",
                        'as':'dependent'
                    }
                },
                {
                    $project:{
                        itemId:1,
                        title:1,
                        is_multiple:1,
                        max_multiple:1,
                        is_dependent:1,
                        dependent_with:1,
                        status:1,
                        dependent:{$size:"$dependent"}
                    }
                }
            ])
            // return testResponse(req,res,resultRow)
            if (resultRow.length==0) {
                responseData={
                    data:{
                        statusCode:400,
                        message:'No Item found',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData)
            }
            resultRow = resultRow[0]
            if(resultRow.dependent > 0){
                responseData={
                    data:{
                        statusCode:400,
                        message:'First delete dependent items',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData)
            }
            await MenuCustomizeVariant.deleteMany({customizeId:resultRow._id})
            await MenuItemCustomize.deleteOne({_id:mongoose.Types.ObjectId(reqData.cusId)})
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
            console.log('exp',error);
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
    const itemCustomizeStatus = async (req,res,next) => {
        let responseData = {}
        try {
            let result = await MenuItemCustomize.findOneAndUpdate({_id:req.body.cusId},[{
                $set:{
                    'status':{$not: "$status"}
                }
            }],{new:true})
            responseData={
                data:{
                    statusCode:200,
                    message:'success',
                    data:result.status
                },
                code:200
            }
            return successResponse(req,res,responseData)
        } catch (error) {
            console.log('exp',error);
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
/* Menu Items customized End */
/* Menu customized items Start */
    const depedentVarientList = async (req,res,next) => {
        let responseData ={}
        try {
            let result = await MenuItemCustomize.aggregate([
                {
                    $match:{
                        _id:mongoose.Types.ObjectId(req.body.cusId)
                    }
                },
                {
                    $lookup:{
                        from:"menuitemcustomizes",
                        let:{"forignId":"$dependent_with"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:['$_id',"$$forignId"]
                                    }
                                }
                            },
                            {
                                $lookup:{
                                    'from':'menucustomizevariants',
                                    'localField':"_id",
                                    'foreignField':"customizeId",
                                    'as':"varients"
                                }
                            },
                            {
                                $project:{
                                    "title":1,
                                    "varients._id":1,
                                    "varients.title":1,
                                }
                            }
                        ],
                        as:"dependent"
                    },
                },
                {
                    $project:{
                        "title":1,
                        "is_multiple":1,
                        "max_multiple":1,
                        "is_dependent":1,
                        "dependent":{
                            $cond: {
                                if: { $gt : [{$size:"$dependent"},0]},
                                then:{"$first":'$dependent'},
                                else:{}
                            }
                        }
                    }
                }

            ])
            responseData={
                data:{
                    statusCode:200,
                    message:'success',
                    data:result[0]
                },
                code:200
            }
            return successResponse(req,res,responseData)
        } catch (error) {
            console.log('exp',error);
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
    const customizeVariantList = async (req,res,next) => {
        let responseData={}
        try {
            // return testResponse(req,res,'customizeVariantList')
            let reqData = req.body
            let cusId = mongoose.Types.ObjectId(reqData.cusId)
            let result = await MenuCustomizeVariant.find({customizeId:reqData.cusId},{"__v":0})
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
            console.log('exp',error);
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
    const customizeVariantDetail = async (req,res,next) => {
        let responseData={}
        try {
            // return testResponse(req,res,'customizeVariantList')
            let reqData = req.body
            let result = await MenuCustomizeVariant.findById(reqData.varId,{"__v":0})
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
            console.log('exp',error);
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
    const customizeVariantCreate = async (req,res,next) => {
        let responseData={}
        try {
            // return testResponse(req,res,'customizeVariantCreate')
            let reqData = req.body
            let customize = await MenuItemCustomize.findById(reqData.customizeId)
            // return testResponse(req,res,customize)
            if (!customize) {
                responseData={
                    data:{
                        statusCode:400,
                        message:'No Customize found',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData)
            }
            if (customize.is_dependent) {
                if (reqData.dependent_price && reqData.dependent_price.length==0) {
                    responseData={
                        data:{
                            statusCode:401,
                            message:"Dependent price's required",
                        },
                        code:401
                    }
                    return errorResponse(req,res,responseData)
                }
            } else {
                if (!reqData.price) {
                    responseData={
                        data:{
                            statusCode:401,
                            message:"Price is required",
                        },
                        code:401
                    }
                    return errorResponse(req,res,responseData)
                }
            }
            if (!customize.is_multiple && reqData.isDefault) {
                await MenuCustomizeVariant.updateMany({customizeId:customize._id},{$set:{"isDefault":false}})
            }
            let insertDataRow ={
                customizeId:reqData.customizeId,
                title:reqData.title,
                price:reqData.price||'0.00',
                isDefault:reqData.isDefault,
            }
            if(reqData.dependent_price.length > 0)
                insertDataRow['dependent_price'] = reqData.dependent_price 
            let insertData = new MenuCustomizeVariant(insertDataRow)
            let result = await insertData.save()
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
            console.log('exp',error);
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
    const customizeVariantUpdate = async (req,res,next) => {
        let responseData={}
        try {
            // return testResponse(req,res,'customizeVariantUpdate')
            let reqData = req.body
            let resultRow = await MenuCustomizeVariant.findById(reqData.varId)
            if (!resultRow) {
                responseData={
                    data:{
                        statusCode:400,
                        message:'No Item found',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData)
            }
            let customize = await MenuItemCustomize.findById(reqData.customizeId)
            if (!customize) {
                responseData={
                    data:{
                        statusCode:400,
                        message:'No Customize found',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData)
            }
            if (customize.is_dependent) {
                if (reqData.dependent_price && reqData.dependent_price.length==0) {
                    responseData={
                        data:{
                            statusCode:401,
                            message:"Dependent price's required",
                        },
                        code:401
                    }
                    return errorResponse(req,res,responseData)
                }
            } else {
                if (!reqData.price) {
                    responseData={
                        data:{
                            statusCode:401,
                            message:"Price is required",
                        },
                        code:401
                    }
                    return errorResponse(req,res,responseData)
                }
            }
            if (!customize.is_multiple && reqData.isDefault) {
                await MenuCustomizeVariant.updateMany({customizeId:customize._id},{$set:{"isDefault":false}})
            }
            let updateData = {
                title:reqData.title,
                isDefault:reqData.isDefault
            }
            if(reqData.price)
                updateData['price'] = reqData.price
            if(reqData.dependent_price.length > 0)
                updateData['dependent_price'] = reqData.dependent_price 
            let result = await resultRow.updateOne({$set:updateData},{new:true})
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
            console.log('exp',error);
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
    const customizeVariantDelete = async (req,res,next) => {
        let responseData={}
        try {
            // return testResponse(req,res,'customizeVariantDelete')
            let reqData = req.body
            let resultRow = await MenuCustomizeVariant.findById(reqData.varId)
            if (!resultRow) {
                responseData={
                    data:{
                        statusCode:400,
                        message:'No Item found',
                    },
                    code:400
                }
                return errorResponse(req,res,responseData)
            }
            resultRow.deleteOne()
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
            console.log('exp',error);
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
/* Menu Items customized End */
module.exports = {categoryList, categoryCreate, categoryDetail,  categoryUpdate, itemList, itemCreate, itemDetail, itemUpdate,itemDelete, itemStatus, itemCustomizeList, itemCustomizeCreate,itemCustomeDetail, itemCustomizeUpdate, itemCustomizeDelete,itemCustomizeStatus, customizeVariantList, customizeVariantDetail, customizeVariantCreate,customizeVariantUpdate, customizeVariantDelete ,depedentVarientList}