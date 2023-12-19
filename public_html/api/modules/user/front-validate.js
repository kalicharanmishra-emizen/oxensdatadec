const { check } = require("express-validator");
const contactUsValidate = (req,res) =>{
    return [
        check('fname')
            .notEmpty().withMessage('First name is required'),
        check('lname')
            .notEmpty().withMessage('Last name is required'),
        check('email')
            .notEmpty().withMessage('Email is required').bail()
            .isEmail().withMessage('Not a valid email address'),
        check('phoneNo')
            .notEmpty().withMessage('Phone Number is required').bail()
            .isMobilePhone().withMessage('Phone Number must be valid number'),
        check('message')
            .notEmpty().withMessage('Message is required')
    ]
}
const becomeStoreValidate = (req,res) =>{
    return [
        check('storeName')
            .notEmpty().withMessage('Store name is required'),
        check('storeType')
            .notEmpty().withMessage('Store type is required'),
        check('cPersonName')
            .notEmpty().withMessage('Contact person name is required'),
        check('cPersonEmail')
            .notEmpty().withMessage('Contact person email is required').bail()
            .isEmail().withMessage('Not a valid email address'),
        check('cPersonPhoneNo')
            .notEmpty().withMessage('Contact person phone number is required').bail()
            .isMobilePhone().withMessage('Phone Number must be valid number'),
        check('storeLocation')
            .notEmpty().withMessage('Store location is required')
    ]
}
const careerValidate = (req,res) =>{
    return [
        check('name')
            .notEmpty().withMessage('Name is required'),
        check('phone_no')
            .notEmpty().withMessage('Phone No. is required').bail()
            .isMobilePhone().withMessage('Phone No. must be valid number'),
        check('email')
            .notEmpty().withMessage('Email is required').bail()
            .isEmail().withMessage('Not a valid email address'),
        check('position')
            .notEmpty().withMessage('Position is required'),
        check('totelExp')
            .notEmpty().withMessage('Total experience is required'),
        check('relExp')
            .notEmpty().withMessage('Relevant experience is required'),
        check('coverLetter')
            .notEmpty().withMessage('Cover Letter is required'),
        check('resume')
            .custom(
                (value,{req})=>{
                    return validate_helper.isFileReq(req.files.resume)
                }
            ).withMessage('Resume is required').bail()
            .custom(
                (value,{req})=>{
                    return validate_helper.isMimeType(req.files.resume,['pdf'])
                }
            ).withMessage('File type not support').bail()
            .custom(
                (value,{req})=>{
                    return validate_helper.isFileSize(req.files.resume,3*1024*1024)
                }
            ).withMessage('File size must be less than 3MB').bail(),
    ]
}
module.exports = {contactUsValidate,becomeStoreValidate,careerValidate}