const { check } = require("express-validator");
/* Discount Validation start */
const discountUpdateValidation = (req,res)=>{
    return [
        check('discountType').notEmpty().withMessage("Discount type is required"),
        check('discountValue').notEmpty().withMessage("Discount value is required"),
        check('maxDiscount').notEmpty().withMessage("Max discount is required")
            
    ]
}
module.exports={discountUpdateValidation}
/* Discount Validation End */