const { check} = require("express-validator");
const orderUpdateValidate = (req,res) =>{
    return [
        check('id')
            .notEmpty().withMessage('Order assign id is required').bail()
            .isMongoId().withMessage('Order assign id is required'),
        check('maxDistance')
            .notEmpty().withMessage('Max distance is required'),
        check('packageLimit')
            .notEmpty().withMessage('Package size is required'),
    ]
}
const mainUpdateValidate = (req,res) =>{
    return [
        check('id')
            .notEmpty().withMessage('Order assign id is required').bail()
            .isMongoId().withMessage('Order assign id is required'),
        check('driverWaitTime')
            .notEmpty().withMessage('Driver wait time is required'),
        check('serviceFee')
            .notEmpty().withMessage('Service fee is required'),
        check('maxServiceFee')
            .notEmpty().withMessage('Max service fee is required'),
        check('deliveryDistance')
            .notEmpty().withMessage('Delivery distance is required'),
        check('minDeliveryCharge')
            .notEmpty().withMessage('Min delivery charge is required'),
        check('deliveryExtraFee')
            .notEmpty().withMessage('Delivery extra fee is required'),
        check('vatCharge')
            .notEmpty().withMessage('Vat charge is required'),
    ]
}
module.exports={orderUpdateValidate,mainUpdateValidate}