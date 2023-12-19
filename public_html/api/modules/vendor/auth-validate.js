const { check } = require("express-validator");
const bcrypt = require('bcrypt');
const Users = require('../../models/usersModel');
const loginValidate = (req,res) =>{
    return [
        check('email')
            .notEmpty().withMessage('Email is required').bail()
            .isEmail().withMessage('Not a valid email address').normalizeEmail(),
        check('password')
            .notEmpty().withMessage('Password is required')
    ]
}
const generalValidate = (req,res) => {
    return [
        check('category')
            .notEmpty().withMessage('Category is required'),
        check('logo').if((value, { req }) => req.files)
            .custom(
                (value,{req})=>{
                    return validate_helper.isMimeType(req.files.logo,['jpeg','png','jpg'])
                }
            ).withMessage('File type not support').bail()
            .custom(
                (value,{req})=>{
                    return validate_helper.isFileSize(req.files.logo,1*1024*1024)
                }
            ).withMessage('File size must be less than 1MB').bail(),
        check('name')
            .notEmpty().withMessage('Name is required').bail(),
        check('phone_no')
            .notEmpty().withMessage('Phone Number is required').bail()
            .isMobilePhone().withMessage('Phone Number must be valid number').bail()
            .custom((phone_no,{req})=>{
                return Users.findOne({phone_no,_id:{$ne:req.user._id}}).then(result => {
                    if (result) {
                         return Promise.reject('Phone Number already taken');     
                    } 
                })
            }),
        check('email')
            .notEmpty().withMessage('Email is required').bail()
            .isEmail().withMessage('Email must be a valid email address').bail()
            .custom((email,{req})=>{
                return Users.findOne({email,_id:{$ne:req.user._id}}).then((result) => {
                   if (result) {
                       return Promise.reject('Email Already taken');       
                   }   
                })  
            }),
        check('contact_person_name')
            .notEmpty().withMessage('Contact person name is required'),
        check('contact_person_email')
            .notEmpty().withMessage('Contact person email is required').bail()
            .isEmail().withMessage('Contact person email must be a vaild email address').normalizeEmail(),
        check('contact_person_phone_no')
            .notEmpty().withMessage('Contact person phone number is required').bail()
            .isMobilePhone().withMessage('Contact person phone number must be valid number'),
        check('address')
            .notEmpty().withMessage('Address is required'),
        check('preparation_time')
            .notEmpty().withMessage('Preparation time is required').bail()
            .isInt({min:1}).withMessage('Pre Time must be not less than 1'),
        check('minimum_amount')
            .notEmpty().withMessage('Minimum amount is required').bail()
            .isInt({min:0}).withMessage('Min order amount not less than 0')
    ]
}
const passwordValidate = (req,res) => {
    return [
        check('old_pass')
            .notEmpty().withMessage('Old Password is required').bail()
            .custom((old_pass,{req})=>{
                return Users.findOne({_id:req.user._id}).then(result=>{
                    if(!bcrypt.compareSync(old_pass,result.password)){
                        return Promise.reject('Old password not match') 
                    }
                });
            }),
        check('new_pass')
            .notEmpty().withMessage('New Password is required'),
        check('con_pass')
            .notEmpty().withMessage('Confirm Password is required').bail()
            .custom((con_pass,{req})=>{
                if (con_pass!==req.body.new_pass) {
                    return false;
                }else{
                    return true;
                }
            }).withMessage('Confirm Password and new password must be same')
    ]
}
const forgotValidate = (req,res) => {
    return [
        check('email')
            .notEmpty().withMessage('Email is required').bail()
            .isEmail().withMessage('Not a valid email address').normalizeEmail()
    ]
}
const resetValidate = (req,res) =>{
    return [
        check('token')
            .notEmpty().withMessage('Token is required'),
        check('new_pass')
            .notEmpty().withMessage('New Password is required'),
        check('con_pass')
            .notEmpty().withMessage('Confirm Password is required').bail()
            .custom((con_pass,{req})=>{
                if (con_pass!==req.body.new_pass) {
                    return false;
                }else{
                    return true;
                }
            }).withMessage('Confirm Password and new password must be same')
    ]
}
const uploadImageValidate = (req,res) =>{
    return [
        check('image')
            .custom(
                (value,{req})=>{
                    return validate_helper.isFileReq(req.files.image)
                }
            ).withMessage('File required').bail()
            .custom(
                (value,{req})=>{
                    return validate_helper.isMimeType(req.files.image,['jpeg','png','jpg'])
                }
            ).withMessage('File type not support').bail()
            .custom(
                (value,{req})=>{
                    return validate_helper.isFileSize(req.files.image,1*1024*1024)
                }
            ).withMessage('File size must be less than 1MB').bail(),
    ]
}
module.exports = {loginValidate,generalValidate,passwordValidate,resetValidate,uploadImageValidate, forgotValidate}