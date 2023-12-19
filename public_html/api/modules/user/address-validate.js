const { check } = require("express-validator");
const createValidate = (req,res) =>{
    return [
        check('location.address')
            .notEmpty().withMessage('Address is required'),
        check('tag')
            .notEmpty().withMessage('Tag is required'),
    ]
}
const updateValidate = (req,res) =>{
    return [
        check('id')
            .notEmpty().withMessage('Address Id is required').bail()
            .isMongoId().withMessage('Address Id is required'),
        check('location.address')
            .notEmpty().withMessage('Address is required'),
        check('tag')
            .notEmpty().withMessage('Tag is required'),
    ]
}
const deleteValidate = (req,res) =>{
    return [
        check('addressId')
            .notEmpty().withMessage('Address is required').bail()
            .isMongoId().withMessage('Address is required'),
    ]
}
module.exports = {createValidate,updateValidate,deleteValidate}