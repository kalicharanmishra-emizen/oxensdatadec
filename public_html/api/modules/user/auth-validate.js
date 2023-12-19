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
const signupValidate = (req,res) =>{
    return [
        check('name')
            .notEmpty().withMessage('Full name is required'),
        check('email')
            .notEmpty().withMessage('Email is required').bail()
            .isEmail().withMessage('Not a valid email address').normalizeEmail().bail()
            .custom((email)=>{
                return Users.findOne({email}).then(result => {
                    if (result) {
                         return Promise.reject('Email Already taken');     
                    } 
                })
            }),
        check('phone_no')
            .notEmpty().withMessage('Phone Number is required').bail()
            .isMobilePhone().withMessage('Phone Number must be valid number').bail()
            .custom((phone_no)=>{
                return Users.findOne({phone_no}).then(result => {
                    if (result) {
                         return Promise.reject('Phone Number Already taken');     
                    } 
                })
            }),
        check("dob")
            .notEmpty().withMessage("Date of birth is required"),
        check('password')
            .notEmpty().withMessage('Password is required')
    ]
}
const generalValidate = (req,res) => {
    return [
        check('name')
            .notEmpty().withMessage('Name is required').bail(),
        check('email')
            .notEmpty().withMessage('Email is required').bail()
            .isEmail().withMessage('Not a valid email address').normalizeEmail().bail()
            .custom((email,{req})=>{
                return Users.findOne({email,_id:{$ne:req.user._id}}).then(result => {
                    if (result) {
                         return Promise.reject('Email Already taken');     
                    } 
                })
            }),
        check('phone_no')
            .notEmpty().withMessage('Phone Number is required').bail()
            .isMobilePhone().withMessage('Phone Number must be valid number').bail()
            .custom((phone_no,{req})=>{
                return Users.findOne({phone_no,_id:{$ne:req.user._id}}).then(result => {
                    if (result) {
                         return Promise.reject('Phone Number Already taken');     
                    } 
                })
            }),
        check("dob")
            .notEmpty().withMessage("Date of birth is required"),
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
            }).withMessage('Confirm Password and New password must be same')
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
module.exports = {loginValidate,signupValidate,generalValidate,passwordValidate,resetValidate,forgotValidate}