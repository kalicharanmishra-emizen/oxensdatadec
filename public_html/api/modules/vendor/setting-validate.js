const { check} = require("express-validator");
const mainUpdateValidate = (req,res) =>{
    return [
        // check('id')
        //     .notEmpty().withMessage('Order assign id is required').bail()
        //     .isMongoId().withMessage('Order assign id is required'),
        check('deliveryDistance')
            .notEmpty().withMessage('Delivery distance is required'),
        check('minDeliveryCharge')
            .notEmpty().withMessage('Min delivery charge is required'),
    ]
}
module.exports={mainUpdateValidate}