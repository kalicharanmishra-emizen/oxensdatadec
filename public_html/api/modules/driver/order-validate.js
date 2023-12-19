const { check} = require("express-validator");
const jobAccpetRejectValidation =(req,res)=>{
    return [
        check('jobId').notEmpty().withMessage('Job is required').bail().isMongoId().withMessage('Job is required').bail(),
        check('status').notEmpty().withMessage('Status is required'),
    ]
}
const pickupOrderValidation =(req,res)=>{
    return [
        check('jobId').notEmpty().withMessage('Job is required').bail().isMongoId().withMessage('Job is not valid').bail(),
        check('orderId').notEmpty().withMessage('Order is required').bail().isMongoId().withMessage('Order is not valid').bail(),
        check('code').notEmpty().withMessage('Code is required').matches(/^[0-9]{4}$/).withMessage('Invalid code'),
    ]
}
const orderStatusValidation =(req,res)=>{
    return [
        check('orderId').notEmpty().withMessage('Order is required').bail().isMongoId().withMessage('Order is not valid').bail(),
        check('status').notEmpty().withMessage('Status is required'),
    ]
}

module.exports={jobAccpetRejectValidation, pickupOrderValidation, orderStatusValidation}