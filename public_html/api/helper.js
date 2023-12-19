const { validationResult } = require("express-validator");
const nodemailer = require('nodemailer');
const mongoose = require("mongoose");
const path = require('path');
const Increment = require('./models/increment/modal');
const DriverJob = require('./models/Driver/jobModel');
// const Order = require('./models/Order/orderModel');
const OrderLog = require('./models/Order/logsModel');
const UsersModel = require('./models/usersModel');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const request = require('request')


const express = require('express');

const XeroRouter = express.Router();
const {  XeroClient, HistoryRecords, Invoice } = require('xero-node');
// const { TokenSet } = require('openid-client');

const axios = require('axios');
const qs = require('qs');
// const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const plivo = require('plivo');
// const AUTH_ID = process.env.PLIVO_AUTH_ID
// const AUTH_TOKEN = process.env.PLIVO_AUTH_TOKEN


successResponse=(req,res,value)=>{
    return  res.status(value.code).json({
                statusCode:value.data.statusCode,
                message:value.data.message,xeroToken:value.data.xero_data,
                data:value.data.data,
            });
}

testResponse=(req,res,value)=>{
    res.status(200).json({
        data:value
    });
}

errorResponse=(req,res,value)=>{
    return  res.status(value.code).json({
                statusCode:value.data.statusCode,
                message:value.data.message
            });
}

generateRendomCode = () =>{
    return Math.floor(1000 + Math.random() * 9000)
    // return 1111
}

// validation response
commonValidate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let response={
            data:{
                statusCode:401,
                message:errors.array()[0].msg
            },
            code:401
        };
        return errorResponse(req, res,response)
    }
    return next();
}

sendEmail = async (mailData) => {
    try {
        let transport = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: process.env.MAIL_SECURE, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USERNAME, // generated ethereal user
                pass: process.env.MAIL_PASSWORD, // generated ethereal password
            },
        })
        let info = await transport.sendMail({
            from: `${process.env.MAIL_FROM_NAME} < ${process.env.MAIL_FROM} >`,
            to:mailData?.to,
            subject:mailData?.subject,
            html:mailData?.temp,
        })  
        return info;
    } catch (e) {
        console.log("email error", e);
        return false;
    }
}

fileUpload = async (file,location='') =>{
    let filename= path.join(location+new Date().toISOString().replace(/:/g, '-')+path.extname(file.name));
    let uploadPath=path.join(process.cwd(),'./public/'+filename);
    await file.mv(uploadPath);
    // ,(err)=>{if(err){responseData={data:{statusCode:500,message:'img not upload',},code:500}return errorResponse(req,res,responseData)}}
    return filename;
}

fileUrlRemove = async (url) =>{
    return url.replace(process.env.PUBLIC_FOLDER_URL,'');
}

convortToObjID = async (data) =>{
   return  mongoose.Types.ObjectId(data)
}

getAutoIncrementValue = async (collectionName) => {
    let result = await Increment.findOneAndUpdate({collectionName:collectionName},{$inc:{'incrementValue':1}},{new:true})
    return result.incrementValue
}

calculateGeoDiatance = async (data) =>{
    try {
        let res = await axios({
            method:'get',
            url:`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${data.origin}&destinations=${data.des}&key=${process.env.MAP_API}`
        })
        if (res.data.status==='OK') {
            let returnData = 0;
            res.data.rows[0]['elements'].forEach(element=>{
                if(element.status==='OK'){
                    returnData =  Number((element.distance.value/1609).toFixed(2))
                }
            })
            return returnData
        }else{
            return 0
        }
    } catch (error) {
        console.log('Distance Matrix error',error);
        return 0
    }
}
    
getDriverPrvJobData = async (preJobId) =>{
    let preJob = await DriverJob.aggregate([
        {
            $match:{
                _id:preJobId
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
                            _id:0,
                            "deliveryAddress.lat":"$deliveryAddress.lat",
                            "deliveryAddress.lng":"$deliveryAddress.lng",
                        }
                    }
                ],
                as:"orderData"
            }
        },
        {
            $project:{
                preJobId:1,
                accpetLocation:1,
                isFirst:1,
                status:1,
                storeLocation:{$first:"$storeData"},
                orderData:{$first:"$orderData"}
            }
        }
    ])
    return preJob[0]||{}
}

sendPushNotification = async (notificationData) =>{
        let sendData = {
            registration_ids : [notificationData.token],
            priority : "high",  
            type : "default",  
            data : notificationData.notification
        }
        if (notificationData.type==='iPhone') {
            sendData['notification']= notificationData.notification
        }
        var config = {
            method: 'post',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: { 
                'Authorization': `key=${process.env.FIREBASE_SERVER_KEY}`, 
                'Content-Type': 'application/json'
            },
            data : JSON.stringify(sendData)
        };
        axios(config)
        .then(response=>{
            // console.log('firebaseResponse',response.data);
        })
        .catch(error=>{
            console.log('firebaseError',error);
        })
}

createOrderLogs = async (orderId,message) => {
    new OrderLog({
        orderId:orderId,
        message:message
    }).save()
}

// send sms by twillo 
sendSMS = async (message, number) => {
    try {
        let data = await client.messages.create({
            body: message,
            from: process.env.TWILIO_NUMBER,
            to: number
        })
        console.log("twillo SMS reponse data", data);
        return true
    } catch (error) {
        console.log("twillo SMS error", error);
        return false
    }
}

// send sms by plivo 
// sendSMS = async (message, number) => {
//     try {
//         var client = new plivo.Client(AUTH_ID, AUTH_TOKEN);
//         client.messages.create(
//           { 
//               src: "OXENSSMSSEN", 
//               dst: number,
//               text: message,
//           }
//         )
//         return true
//     } catch (error) {
//         console.log("plivo SMS error", error);
//         return false
//     }
// }


fakeCall = async (number_to, number_from) => {
    try {
        let data = await client.calls
        .create({
           url: 'http://demo.twilio.com/docs/voice.xml',
           to: '+123456789',
           from: '+987654321'
         })

         
        // .then(call => console.log(call.sid));
        // console.log("twillo fake call reponse data", data.sid);
        return true
    } catch (error) {
        console.log("twillo fake call error", error);
        return false
    }
}

createStripeCus = async (dataObj) => {
    try {
        const existsCustomer = await UsersModel.findById(dataObj.userID)
        // console.log("existsCustomer", existsCustomer);
        if (existsCustomer.stripeCusId !== null) {
            // console.log("already created");
            return existsCustomer.stripeCusId
        }

        const data = await Stripe.customers.create({
            name: dataObj.name ?? "",
            email: dataObj.email ?? '',
            description: dataObj.description ?? ""
        });
        let updateData={
            stripeCusId:data.id,
        }
        await UsersModel.findByIdAndUpdate(dataObj.userID,{$set:updateData})
        // console.log("create stripe customer response",data);
        return data
    } catch (error) {
        console.log("create stripe customer eerror",error);
        return false
    }
}

// xero token get
xeroTokenGenrate =  async (clientId, secretKey, xeroApi) => {
/*    try {
        const myString = clientId + ":" + secretKey;
        const encodeAuth = Buffer.from(myString)
                      .toString('base64');
        console.log(encodeAuth);
       
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
        'grant_type': 'client_credentials' 
        });
        var config = {
        method: 'post',
        url: xeroApi,
        headers: { 
            'Authorization': 'Basic ' + encodeAuth, 
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
        };

        let response  = await  axios(config)
        .then(function (response) {
            let xeroResponse = response.data.access_token;
            return xeroResponse;
        })
        .catch(function (error) {
            console.log(error);
            return error
           
        });

        return response;
    } catch (error) {
        console.log("xero token generate", error);
    }*/
}

//xero software detail take from client side after then uncomment this xero software related code
xeroTenantDetail = async (token, xeroApi) => {
    try {
       /* var config = {
        method: 'get',
        url: xeroApi,
            headers: { 
                'Authorization': 'Bearer ' + token
            }
        };

        let response = await axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            let xeroResponse = response.data;
            return xeroResponse[0].tenantId;
        })
        .catch(function (error) {
            console.log(error);
            return error;
        });
        return response;*/
    } catch (error) {
        console.log("xero tenant detail", error);
    }
}

xeroUserRegister = async (tenantId, token, xeroApi, data) => {
    try {
       /* var data = JSON.stringify(data);

        var config = {
        method: 'post',
        url: xeroApi,
        headers: { 
            'xero-tenant-id': tenantId, 
            'Content-Type': 'application/json', 
            'Accept': 'application/json', 
            'Authorization': 'Bearer ' + token
        },
        data : data
        };

        let response = await axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            let xeroResponse = response.data;
            return xeroResponse;
        })
        .catch(function (error) {
            console.log(error);
            return error;
        });

        return response;*/

    } catch (error) {
        console.log("xero customer register error: ", error);
    }
}


xeroItemCreate = async (token, tenantId, xeroApi, data) => {
    try {
      /*  var data = JSON.stringify(data);

        var config = {
        method: 'post',
        url: xeroApi,
        headers: { 
            'xero-tenant-id': tenantId, 
            'Content-Type': 'application/json', 
            'Accept': 'application/json', 
            'Authorization': 'Bearer ' + token
        },
        data : data
        };

        let response = await axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            let xeroResponse = response.data;
            return xeroResponse;
        })
        .catch(function (error) {
            console.log(error);
            return error;
        });

        return response;*/
    } catch (error) {
        console.log("xero item create error: ", error);
    }
}
// order create in xero account
// xero token get
xeroOrderCreate =  async (token, tenantId, orderApi, orderData) => {
    try {
        // var axios = require('axios');
       /* var data = JSON.stringify(orderData);

        var config = {
        method: 'post',
        url: orderApi,
        headers: { 
            'xero-tenant-id': tenantId,
            'Content-Type': 'application/json', 
            'Accept': 'application/json', 
            'Authorization': 'Bearer ' + token
        },
        data : data
        };

        let response = await axios(config)
        .then(function (response) {
            let xeroResponse = response.data;
            console.log(JSON.stringify(response.data));
            return xeroResponse;
        })
        .catch(function (error) {
            console.log(error);
            return error;
        });
        return response;*/
    } catch (error) {
        console.log("xero order create:", error);
    }
}

xeroInvoiceCreate = async (xeroInvoiceApi, tenantId, token, invoiceData) => {
    try {
       /* var data = JSON.stringify(invoiceData);

        var config = {
        method: 'put',
        url: xeroInvoiceApi,
        headers: { 
            'xero-tenant-id': tenantId,
            'Content-Type': 'application/json', 
            'Accept': 'application/json', 
            'Authorization': 'Bearer ' + token
        },
        data : data
        };

        let response = await axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            let xeroInvocecRes = response.data;
            return xeroInvocecRes;
        })
        .catch(function (error) {
            console.log(error);
            return error;
        });

        return response;*/
    } catch (error) {
        console.log('xero invoice create: ', error);
    }
}

// twilio
twilioCreateService = async (clientMob,driverMob) => {
    try {
      console.log("in");
      let serviceData = '';
      let sid = null
      let serviceUniqueName = Math.random() * (999999 - 1) + 1;
      await client.proxy.v1.services
        .create({
          uniqueName: "twilio_proxy_service_" + Math.round(serviceUniqueName),
        })
        .then(async (service) =>  {
            serviceData = await getAllActiveNumber(service.sid,clientMob,driverMob) // console.log('services: ', service.sid)
               sid = service.sid;
            }
        );
        // console.log('serviceData  ==== == ', serviceData);  
        return serviceData;
    } catch (error) {
      console.log("Twilio Proxy service create: ", error);
    }
  };
  
  const getAllActiveNumber = async (service_id,clientMob,driverMob) => {
    try {     
        let twilioPhoneNoAdd = '';
        let getIncomeNumber = '';
        getIncomeNumber = await getIncomingPhoneNumber(accountSid, authToken);

        const newNo = await JSON.parse(getIncomeNumber).incoming_phone_numbers.map(
            (number) => {
                if (!number.voice_url.includes("/Proxy/")) {
                return { sid: number.sid, number: number.phone_number };
                }
            }
        );

        const assignedNo = newNo.filter(Boolean);
        if(assignedNo.length === 0)
        {
            twilioPhoneNoAdd = {'error':true,'message':'This number is busy. Please try again after some time', 'serviceSid':'', 'proxyIdentifier':''};
            // console.log('twilioPhoneNoAdd== -- ==', twilioPhoneNoAdd);
            return twilioPhoneNoAdd;
        }
        
        const proxtNoSid = await assignedNo[0].sid;
        
        twilioPhoneNoAdd = await addTwilioPhoneNo(service_id, proxtNoSid, clientMob, driverMob);
            // console.log('twilioPhoneNoAdd = ',twilioPhoneNoAdd);
      return twilioPhoneNoAdd;
    } catch (err) {
      console.log(err);
    }
  };

  const getIncomingPhoneNumber = async (accountSid, authToken) => {
    try {
        let incomeNumber = null;
        const myString = accountSid + ":" + authToken;
        const encodeAuth = Buffer.from(myString)
                      .toString('base64');
        let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.twilio.com/2010-04-01/Accounts/'+accountSid+'/IncomingPhoneNumbers.json',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded', 
            'Authorization': 'Basic ' +encodeAuth
        },
        };

        await axios.request(config)
        .then(async (response) => {
            // console.log('dgdfgdfgdfgfdg ========= ', JSON.stringify(response.data));
            incomeNumber = JSON.stringify(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
        
        return incomeNumber;
    } catch (err) {
        console.log('get incoming phone number data error ', err);
    }
  }
  
  //add phone number
  const addTwilioPhoneNo = async (service_id, proxtNoSid, clientMob,driverMob) => {
    try {
        let phoneData = '';
      await client.proxy.v1
        .services(service_id)
        .phoneNumbers.create({
          sid: proxtNoSid,
        })
        .then(async (phone) => {
            phoneData = await createSession(service_id, phone.phoneNumber, clientMob,driverMob);
        });

        // console.log('phoneData = ======= ==', phoneData);
        return phoneData;
    } catch (error) {
      console.log("Twilio phone number add in proxy service: ", error);
    }
  };
  
  //create twilio session
  const createSession = async (service_id, phone_number, clientMob,driverMob) => {
    let sessionData = '';
    await client.proxy.v1
      .services(service_id)
      .sessions.create({ mode: "voice-only" })
      .then(async (session) =>
        sessionData = await createParticipants(
          service_id,
          session.sid,
          phone_number,
          clientMob,driverMob
        )
      );
      
      return sessionData;
  };
  //create twilio participants
  const createParticipants = async (service_id, session, number, clientMob,driverMob) => {
    let participantData = '';
    await client.proxy.v1
      .services(service_id)
      .sessions(session)
      .participants.create({
        identifier: clientMob,
        proxyIdentifier: number,
      })
      .then(function (participant){
        /*Order.findOneAndUpdate(
          { _id: orderId },
          { maskedNo: participant.proxyIdentifier }
        )*/
        participantData = participant
        // console.log(participant)
        });
  
    await client.proxy.v1
      .services(service_id)
      .sessions(session)
      .participants.create({
        identifier: driverMob,
        proxyIdentifier: number,
      })
      .then(function(participant){
            participantData = participant
            // console.log(participantData)
        });
        // console.log('participantData = ===== == ',participantData);
      return participantData;
  };
//   twillio service delete
 twilioDeleteService = async (sid) => {
    try {
        const myString = accountSid + ":" + authToken;
        const encodeAuth = Buffer.from(myString)
                      .toString('base64');
        // let data = qs.stringify({});

        let config = {
        method: 'DELETE',
        maxBodyLength: Infinity,
        url: 'https://proxy.twilio.com/v1/Services/'+sid,
        headers: { 
            'Access-Control-Allow-Methods': 'DELETE',
            'Authorization': 'Basic ' + encodeAuth
        }
        };

        axios.request(config)
        .then((response) => {
             console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
        console.log(error);
        });

    } catch (error) {
        console.log("Twilio Proxy service sid wrong: ", error);
    }
}
module.exports = {successResponse, testResponse, errorResponse, commonValidate, sendEmail,fileUrlRemove, fileUpload, convortToObjID, getAutoIncrementValue, calculateGeoDiatance, getDriverPrvJobData, sendPushNotification, createOrderLogs, sendSMS, createStripeCus, fakeCall, xeroTokenGenrate, xeroTenantDetail, xeroUserRegister, xeroItemCreate, xeroOrderCreate, xeroInvoiceCreate, twilioCreateService, twilioDeleteService}