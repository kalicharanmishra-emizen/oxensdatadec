const { check} = require("express-validator");
const reasonListValidation =(req,res)=>{
    return [
        check('type').notEmpty().withMessage('Reason type is required'),
    ]
}
const requestSupportValidation =(req,res)=>{
    return [
        check('reason').notEmpty().withMessage('Reason is required'),
        check('description').notEmpty().withMessage('Description is required'),
    ]
}
const orderRejectValidation =(req,res)=>{
    return [
        check('reason').notEmpty().withMessage('Reason is required'),
        check('description').notEmpty().withMessage('Description is required'),
        check('orderIds').notEmpty().withMessage("Order Ids is required")
    ]
}
const fireBaseTokenValidation = (req,res) =>{
    return [
        check('fireBaseToken').notEmpty().withMessage('Token is required'),
        check('type').notEmpty().withMessage('Device Type is required'),
    ]
} 
const notificationStatusValidation = (req,res) =>{
    return [
        check('status').notEmpty().withMessage('Status is required'),
    ]
} 
module.exports={reasonListValidation, requestSupportValidation, orderRejectValidation, fireBaseTokenValidation, notificationStatusValidation}