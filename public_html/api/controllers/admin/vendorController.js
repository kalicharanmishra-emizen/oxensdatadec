const bcrypt = require('bcrypt');
const ejs = require('ejs');
const path = require('path');
const User = require('../../models/usersModel');
const Role = require('../../models/roleModel');
const { successResponse, errorResponse, testResponse, xeroTokenGenrate, xeroTenantDetail, xeroUserRegister } = require('../../helper');
const Setting = require("../../models/Setting/vendorMainSettingModel")
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
                                            "$eq": ["$name", "Vendor"]
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
                    "password":1,
                    "phone_no":1,
                    "status":1,
                    "role":1,
                    "createdAt":1,
                    "vendor_profile":1,
                    "pro_image": {
                       $cond: {
                           if:{$ne : ["$pro_image", null]},
                           then:{$concat:[process.env.PUBLIC_FOLDER_URL,"$pro_image"]},
                           else:{$concat:[process.env.PUBLIC_FOLDER_URL,"user.jpg"]}
                       }
                    },
                    "deliveryType":"$vendor_profile.deliveryType",
                    "assignPOS": "$vendor_profile.assignPOS"
                },  
            },
        ]);
        let vendorList= await User.aggregatePaginate(user,{page:req.query.page})
        responseData = {
            data: {
                statusCode: 201,
                message: "success",
                data: vendorList
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
const edit = async (req, res, next) => {
    try {
        let responseDetail = await User.findById(req.body.userId).populate('role')
        if (!responseDetail) {
            responseData = {
                data: {
                    statusCode: 404,
                    message: 'user not found',
                },
                code: 404
            }
            return errorResponse(req, res, responseData)
        }
        let vendorDetail = {
            _id: responseDetail._id,
            name: responseDetail.name,
            email: responseDetail.email,
            phone_no: responseDetail.phone_no,
            status: responseDetail.status,
            role: responseDetail.role,
            vendor_profile: {
                typeOf: responseDetail.vendor_profile.typeOf,
                deliveryType: responseDetail.vendor_profile.deliveryType,
                assignPOS: responseDetail.vendor_profile.assignPOS,
                location: {
                    address: responseDetail.vendor_profile.location.address,
                    lat: responseDetail.vendor_profile.location.late,
                    lng: responseDetail.vendor_profile.location.lng
                },
                commission: responseDetail.vendor_profile.commission,
                contactPerson: {
                    name: responseDetail.vendor_profile.contactPerson.name,
                    email: responseDetail.vendor_profile.contactPerson.email,
                    phone_no: responseDetail.vendor_profile.contactPerson.phone_no
                },
                hygiene_url: responseDetail.vendor_profile.hygiene_url
            }
        }
        responseData = {
            data: {
                statusCode: 201,
                message: "success",
                data: vendorDetail
            },
            code: 201
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

const create = async (req, res, next) => {
    let responseData = {};
    let successMessage = 'Success'
    try {
        let rendomePass = Math.floor((Math.random() * 1000000)).toString()
        let roleId = await Role.findOne({ name: "Vendor" })
        let reqData = req.body

        // xero token get
         let clientID = process.env.XERO_CLIENT_ID;
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
         let xeroContactsCreateApi = process.env.XERO_USER_REGISTER_API;
         data = {
             "Contacts": [
                 {
                 "Name": reqData.name,
                 "FirstName": reqData.name,
                 // "LastName": "customer2",
                 "EmailAddress": reqData.email,
                 // "Phones":reqData.phone_no,
                 "IsSupplier":"true",
                 "ContactPersons": [
                     {
                     "FirstName": reqData.name,
                     // "LastName": "Smith",
                     "EmailAddress": reqData.email,
                     "IncludeInEmails": "true",
                     // "Phones":reqData.phone_no
                     }
                 ]
                 }
             ]
         }
         
         const xeroContactsCreate = await helper.xeroUserRegister(xeroGetTenantID, xeroTokenGet, xeroContactsCreateApi, data);
         console.log("xero contact user create: ",xeroContactsCreate);
         
        const user = new User({
            name: reqData.name,
            email: reqData.email,
            password:bcrypt.hashSync(rendomePass,10),
            phone_no: reqData.phone_no,
            status: reqData.status,
            role: [roleId._id],
            contact_id:xeroContactsCreate.Contacts[0].ContactID,
            vendor_profile: {
                typeOf: reqData.typeOf,
                deliveryType: reqData?.deliveryType,
                assignPOS: reqData?.assignPOS,
                location: {
                    address: reqData.location.address,
                    late: reqData.location.lat,
                    lng: reqData.location.lng,
                    location:{
                        coordinates:[reqData.location.lng,reqData.location.lat]
                    }
                },
                commission: reqData.commission,
                contactPerson: {
                    name: reqData.contact_person_name,
                    email: reqData.contact_person_email,
                    phone_no: reqData.contact_person_phone_no
                },
                hygiene_url: reqData.hygiene_url || null
            }
        })
        let responseDetailRow = await user.save()
        // create new driver fee object for vendor 
        if (responseDetailRow._id) {
            await new Setting({
                storeId:responseDetailRow._id,
                fixLimitDeliveryDistance:0,
                deliveryDistance:0,
                minDeliveryCharge:0,
                deliveryExtraFeeUnit:0,
                deliveryExtraFee:0,
            }).save()
        }
        let responseDetail = await User.findById(responseDetailRow._id).populate('role')
        let mailTempData={
            name:responseDetail.name,
            email: responseDetail.email,
            password:rendomePass
        }
        let temp = await ejs.renderFile(path.join(__basedir+'/mail-temp/welcome.ejs'),mailTempData)
        let mailData = {
            to:responseDetail.email,
            subject:`Welcome ${responseDetail.name}`,
            temp:temp
        }
        let mailResponse = await sendEmail(mailData)
        if (!mailResponse) {
            successMessage = 'Mail not send'
        }
        let vendorDetail = {
            _id: responseDetail._id,
            name: responseDetail.name,
            email: responseDetail.email,
            phone_no: responseDetail.phone_no,
            status: responseDetail.status,
            role: responseDetail.role,
            vendor_profile: {
                typeOf: responseDetail.vendor_profile.typeOf,
                deliveryType: responseDetail.vendor_profile.deliveryType,
                assignPOS: responseDetail.vendor_profile.assignPOS,
                location: {
                    address: responseDetail.vendor_profile.location.address,
                    late: responseDetail.vendor_profile.location.late,
                    lng: responseDetail.vendor_profile.location.lng
                },
                commission: responseDetail.vendor_profile.commission,
                contactPerson: {
                    name: responseDetail.vendor_profile.contactPerson.name,
                    email: responseDetail.vendor_profile.contactPerson.email,
                    phone_no: responseDetail.vendor_profile.contactPerson.phone_no
                },
                hygiene_url: responseDetail.vendor_profile.hygiene_url
            }
        }
        responseData = {
            data: {
                statusCode: 201,
                message: successMessage,
                data: vendorDetail
            },
            code: 201
        }
        successResponse(req, res, responseData)
    } catch (error) {
        console.log('error',error);
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
const update = async (req, res, next) => {
    let responseData = {};
    try {
        let roleId = await Role.findOne({ name: "Vendor" })
        let reqData = req.body
        let updateData = {
            name: reqData.name,
            email: reqData.email,
            phone_no: reqData.phone_no,
            status: reqData.status,
            role: [roleId._id],
            "vendor_profile.typeOf":reqData.typeOf,
            "vendor_profile.deliveryType":reqData.deliveryType,
            "vendor_profile.assignPOS":reqData.assignPOS,
            "vendor_profile.location.address": reqData.location.address,
            "vendor_profile.location.late": reqData.location.lat || null,
            "vendor_profile.location.lng": reqData.location.lng || null,
            "vendor_profile.location.location.type":"Point",
            "vendor_profile.location.location.coordinates":[reqData.location.lng || 0,reqData.location.lat || 0] ,
            "vendor_profile.contactPerson.name": reqData.contact_person_name,
            "vendor_profile.contactPerson.email": reqData.contact_person_email,
            "vendor_profile.contactPerson.phone_no": reqData.contact_person_phone_no,
            "vendor_profile.commission": reqData.commission,
            "vendor_profile.hygiene_url": reqData.hygiene_url || null
        }
        let responseDetail = await User.findOneAndUpdate({ _id: reqData._id }, {$set:updateData}, { new: true }).populate('role')
        let vendorDetail = {
            _id: responseDetail._id,
            name: responseDetail.name,
            email: responseDetail.email,
            phone_no: responseDetail.phone_no,
            status: responseDetail.status,
            role: responseDetail.role,
            vendor_profile: {
                typeOf: responseDetail.vendor_profile.typeOf,
                deliveryType: responseDetail.vendor_profile.deliveryType,
                assignPOS: responseDetail.vendor_profile.assignPOS,
                location: {
                    address: responseDetail.vendor_profile.location.address,
                    late: responseDetail.vendor_profile.location.late,
                    lng: responseDetail.vendor_profile.location.lng
                },
                commission: responseDetail.vendor_profile.commission,
                contactPerson: {
                    name: responseDetail.vendor_profile.contactPerson.name,
                    email: responseDetail.vendor_profile.contactPerson.email,
                    phone_no: responseDetail.vendor_profile.contactPerson.phone_no
                },
                hygiene_url: responseDetail.vendor_profile.hygiene_url
            }
        }
        responseData = {
            data: {
                statusCode: 201,
                message: "success",
                data: vendorDetail
            },
            code: 201
        }
        successResponse(req, res, responseData)
    } catch (error) {
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
module.exports = { list, create, update ,edit}