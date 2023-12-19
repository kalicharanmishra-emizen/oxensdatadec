const { check } = require("express-validator");
const ratingValidate = (req,res) =>{
    return [
        check("selectReason")
            .notEmpty().withMessage("Reason is required"),

        check("description")
            .notEmpty().withMessage("Reason is required"),

        check('orderId')
            .notEmpty().withMessage('orderId is required').bail()
            .isMongoId().withMessage("Please enter valid orderId"),

        check('storeId')
            .notEmpty().withMessage('storeId is required').bail()
            .isMongoId().withMessage("Please enter valid storeId"),
    ]
}
module.exports = {ratingValidate}