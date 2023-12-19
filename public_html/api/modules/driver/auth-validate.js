const { check } = require("express-validator");
const bcrypt = require('bcrypt');
const Users = require('../../models/usersModel');
const signupValidation=(req,res)=>{
    return [
        check('name').notEmpty().withMessage('Name is Empty'),
        check('email')
            .notEmpty().withMessage('Email field is required').bail()
            .isEmail().withMessage('Email must be a valid email address').normalizeEmail().bail()
            .custom(email=>{
                return Users.findOne({email}).then((result) => {
                    if (result) {
                        return Promise.reject('Email Already taken');       
                    }   
                })  
            }),
        check('password').notEmpty().withMessage('Password is Empty'),
        check('con_password')
            .notEmpty().withMessage('Confirm Password is Empty').bail()
            .custom((con_password,{req})=>{
                if (con_password!==req.body.password) {
                    return false;
                }else{
                    return true;
                }
            }).withMessage('Confirm Password and password must be same'),
        check('dob').notEmpty().withMessage('Date of Birth is required'),
        check('phone_no')
            .notEmpty().withMessage('Phone Number is required').bail()
            .isMobilePhone(['en-GB','en-IN']).withMessage('Phone Number must be valid number').bail()
            .custom(phone_no=>{
                return Users.findOne({phone_no}).then(result => {
                    if (result) {
                        return Promise.reject('Phone Number Already taken');     
                    } 
                })
            }),
        check('country').notEmpty().withMessage('Country is required'),
        check('county').notEmpty().withMessage('County is required'),
        check('city').notEmpty().withMessage('City is required'),
        check('postcode').notEmpty().withMessage('Postcode is required'),
        check('address').notEmpty().withMessage('Address is required'),
        check('vehicleType').notEmpty().withMessage('Vehicle Type is required'),
    ]
}
const loginValidation =(req,res)=>{
    return [
        check('email').notEmpty().withMessage('Email field is required').bail().isEmail().withMessage('Email must be a valid email address').normalizeEmail(),
        check('password').notEmpty().withMessage('Password is Empty'),
    ]
}
const updateValidation=(req,res)=>{
    return [
        check('name').notEmpty().withMessage('Name is Empty'),
        check('email').notEmpty().withMessage('Email field is required').bail().isEmail().withMessage('Email must be a valid email address').normalizeEmail().bail().custom((email,{req})=>{
             return Users.findOne({email,_id:{$ne:req.user._id}}).then((result) => {
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
    ]
}
const changeProfileImageValidation = (req,res)=>{
    return [
        check('pro_image')
        .custom(
            (value,{req})=>{
                return validate_helper.isFileReq(req.files.pro_image)
            }
        ).withMessage('Profile image required').bail()
        .custom(
            (value,{req})=>{
                return validate_helper.isMimeType(req.files.pro_image,['jpeg','png','jpg'])
            }
        ).withMessage('File type not suport').bail()
        .custom(
            (value,{req})=>{
                return validate_helper.isFileSize(req.files.pro_image,5*1024*1024)
            }
        ).withMessage('file size must be less than 5MB').bail(),
    ]
}
const changePassValidation=(req,res)=>{
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
const currentLocationValidate = (req,res)=>{
    return [
        check('lat').notEmpty().withMessage('Latitude is required').bail().isDecimal().not().withMessage('Latitude must be a numaric value'),
        check('lng').notEmpty().withMessage('Longitude is required').bail().isDecimal().not().withMessage('Longitude must be a numaric value')
    ]
}
const sendVerificationValidate = (req,res)=>{
    return [
        check('type').notEmpty().withMessage('Verification type required')
    ];
}
const verifiedVerificationValidate = (req,res)=>{
    return [
        check('type').notEmpty().withMessage('Verification type required'),
        check('verify_token').notEmpty().withMessage('Verification token required')
    ];
}
module.exports={signupValidation,loginValidation,updateValidation,changeProfileImageValidation,changePassValidation,resetValidate,currentLocationValidate,sendVerificationValidate,verifiedVerificationValidate}