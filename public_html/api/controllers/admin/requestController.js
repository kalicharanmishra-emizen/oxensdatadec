const Contact = require('../../models/contactUsModel');
const Career = require('../../models/careerModel');
const BecomeStore = require('../../models/becomeStoreModel');
const { successResponse, errorResponse, testResponse } = require('../../helper');
/* functions strat */
    const contactUs = async (req,res,next) => {
        let responseData = {}
        try {
            let result = await Contact.find({},
                {
                    "__v":0
                },
                {
                    sort: { 
                        createdAt: -1
                    }       
                }
            )
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
    const career = async (req,res,next) => {
        let responseData = {}
        try {
            let result = await Career.find({},
                {
                    'name':1,
                    'phone_no':1,
                    'email':1,
                    'position':1,
                    'curProfile':1,
                    'totelExp':1,
                    'relExp':1,
                    'coverLetter':1,
                    'resume':{
                        $cond: {
                            if:{$ne : ["$resume", null]},
                            then:{$concat:[process.env.PUBLIC_FOLDER_URL,"$resume"]},
                            else:null
                        }
                    },
                    'createdAt':1,
                },
                {
                    sort: { 
                        createdAt: -1
                    }       
                }
            )
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
    const becomeStore = async (req,res,next) => {
        let responseData = {}
        try {
            let result = await BecomeStore.find({},
                {
                    "__v":0
                },
                {
                    sort: { 
                        createdAt: -1
                    }       
                }
            )
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
    
/* functions end */
module.exports = {contactUs,career,becomeStore}