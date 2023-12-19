const { check } = require("express-validator");
const bcrypt = require('bcrypt');
const Users = require('../../models/usersModel');
const getValidation=(req,res)=>{
    return [
        check('userId')
            .notEmpty().withMessage('select a user').bail(),
    ]
}
const createValidation=(req,res)=>{
    return [
        check('typeOf')
            .notEmpty().withMessage('Vendor type required').bail(),
        check('name')
            .notEmpty().withMessage('Vendor name required').bail(),
        check('email')
            .notEmpty().withMessage('Email is required').bail()
            .isEmail().withMessage('Email must be a valid email address').bail()
            .custom(email=>{
                return Users.findOne({email}).then((result) => {
                   if (result) {
                       return Promise.reject('Email Already taken');       
                   }   
                })  
            }),
        check('phone_no')
            .notEmpty().withMessage('Phone Number is required').bail()
            .isMobilePhone().withMessage('Phone Number must be valid number').bail()
            .custom(phone_no=>{
                return Users.findOne({phone_no}).then(result => {
                    if (result) {
                         return Promise.reject('Phone Number Already taken');     
                    } 
                })
            }),
        check('commission')
            .notEmpty().withMessage('Commission is required'),
        check('contact_person_name')
            .notEmpty().withMessage('Contact person name is required'),
        check('contact_person_email')
            .notEmpty().withMessage('Contact person email is required').bail()
            .isEmail().withMessage('Contact person email must be a vaild email address'),
        check('contact_person_phone_no')
            .notEmpty().withMessage('Contact person phone number is required').bail()
            .isMobilePhone().withMessage('Contact person phone number must be valid number'),
        check('location.address')
            .notEmpty().withMessage('Address is required'),
        check('status')
            .notEmpty().withMessage('Status is required'),
        check('hygiene_url')
            .optional({checkFalsy:true})
            .isURL().withMessage('Not a valid url'),
    ]
}
const updateValidation=(req,res)=>{
    return [
        check('_id')
            .notEmpty().withMessage('vendor id is required').bail()
            .isMongoId().withMessage('not a valid user id').bail()
            .custom(_id=>{
                return Users.findOne({_id}).then((result)=>{
                    if (!result) {
                        return Promise.reject('vendor not found')
                    }
                })
            }),
        check('typeOf')
            .notEmpty().withMessage('Vendor type required').bail(),
        check('name')
            .notEmpty().withMessage('Vendor name required').bail(),
        check('email')
            .notEmpty().withMessage('Email is required').bail()
            .isEmail().withMessage('Email must be a valid email address').bail()
            .custom((email,{req})=>{
                return Users.findOne({email,_id:{$ne:req.body._id}}).then((result) => {
                   if (result) {
                       return Promise.reject('Email Already taken');       
                   }   
                })  
            }),
        check('phone_no')
            .notEmpty().withMessage('Phone Number is required').bail()
            .isMobilePhone().withMessage('Phone Number must be valid number').bail()
            .custom((phone_no,{req})=>{
                return Users.findOne({phone_no,_id:{$ne:req.body._id}}).then(result => {
                    if (result) {
                         return Promise.reject('Phone Number Already taken');     
                    } 
                })
            }),
        check('commission')
            .notEmpty().withMessage('Commission is required'),
        check('contact_person_name')
            .notEmpty().withMessage('Contact person name is required'),
        check('contact_person_email')
            .notEmpty().withMessage('Contact person email is required').bail()
            .isEmail().withMessage('Contact person email must be a vaild email address'),
        check('contact_person_phone_no')
            .notEmpty().withMessage('Contact person phone number is required').bail()
            .isMobilePhone().withMessage('Contact person phone number must be valid number'),
        check('location.address')
            .notEmpty().withMessage('Address is required'),
        check('hygiene_url')
            .optional({checkFalsy:true})
            .isURL().withMessage('Not a valid url'),
    ]
}


module.exports={createValidation,updateValidation,getValidation}