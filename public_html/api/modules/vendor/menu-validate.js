const { check } = require("express-validator");
/* Menu Item Validation start */
    const itemCreateValidate = (req,res) =>{
        return [
            check('category')
                .notEmpty().withMessage('Category is required').bail()
                .isMongoId().withMessage('Category is required'),
            check('age_res')
                .notEmpty().withMessage('Age Restriction required'),
            check('title').notEmpty().withMessage('title is required'),
            // check('description').notEmpty().withMessage('Description is required'),
            check('is_customize').notEmpty().withMessage('Customize is required'),
            check('price')
                .if((value, { req }) => req.body.is_customize==0)
                .notEmpty().withMessage('Price is required'),
            check('status').notEmpty().withMessage('Status is required'),
            check('item_img')
                .custom(
                    (value,{req})=>{
                        return validate_helper.isFileReq(req.files.item_img)
                    }
                ).withMessage('Item image is required').bail()
                .custom(
                    (value,{req})=>{
                        return validate_helper.isMimeType(req.files.item_img,['png','jpg','jpeg'])
                    }
                ).withMessage('Item image type not support')
        ]
    }
    const itemUpdateValidate = (req,res) =>{
        return [
            check('category')
                .notEmpty().withMessage('Category is required').bail()
                .isMongoId().withMessage('Not a valid value'),
            check('age_res')
                .notEmpty().withMessage('Age Restriction required'),
            check('title').notEmpty().withMessage('title is required'),
            check('description').notEmpty().withMessage('Description is required'),
            check('is_customize').notEmpty().withMessage('Customize is required'),
            check('price')
                .if((value, { req }) => req.body.is_customize==0)
                .notEmpty().withMessage('Price is required').bail()
                .isFloat({ min: 1}).withMessage('Price not less than 1'),
            check('status').notEmpty().withMessage('Status is required'),
            check('item_img')
                .if((value, { req }) => req.files)
                .custom(
                    (value,{req})=>{
                        return validate_helper.isMimeType(req.files.item_img,['png','jpg','jpeg'])
                    }
                ).withMessage('Item image type not support')
        ]
    }
/* Menu Item Validation end */
/* Menu Item Customize Validation start */
    const itemCustomizeCreateValidate = (req,res) =>{
        return [
            check('itemId')
                .notEmpty().withMessage('Item required').bail()
                .isMongoId().withMessage('Not a valid Item'),
            check('title')
                .notEmpty().withMessage('Title is required'),
            check('is_multiple')
                .notEmpty().withMessage('Customize type required'),
            check('is_dependent')
                .notEmpty().withMessage('Customize dependecy type is required'),
            check('dependent_with')
                .if((value, { req }) => req.body.is_dependent==1)
                .notEmpty().withMessage('Customize dependecy is required').bail()
                .isMongoId().withMessage('Not a valid customize dependecy'),
            check('status')
                .notEmpty().withMessage('Status is required')
        ]
    }
    const itemCustomizeUpdateValidate = (req,res) =>{
        return [
            check('cusId')
                .notEmpty().withMessage('Customize required').bail()
                .isMongoId().withMessage('Not a valid customize value'),
            check('itemId')
                .notEmpty().withMessage('Item required').bail()
                .isMongoId().withMessage('Not a valid Item'),
            check('title')
                .notEmpty().withMessage('Title is required'),
            check('is_multiple')
                .notEmpty().withMessage('Customize type required'),
            check('is_dependent')
                .notEmpty().withMessage('Customize dependecy type is required'),
            check('dependent_with')
                .if((value, { req }) => req.body.is_dependent==1)
                .notEmpty().withMessage('Customize dependecy is required').bail()
                .isMongoId().withMessage('Not a valid customize dependecy'),
            check('status')
                .notEmpty().withMessage('Status is required')
        ]
    }
/* Menu Item Customize Validation end */
/* Menu Customize Items Validation start */
    const customizeVariantCreateValidate = (req,res) =>{
        return [
            check('customizeId')
                .notEmpty().withMessage('Customize required').bail()
                .isMongoId().withMessage('Not a valid customize value'),
            check('title')
                .notEmpty().withMessage('Title is required'),
            check('isDefault')
                .notEmpty().withMessage('Varient Default value required'),
            check('dependent_price')
                .isArray().withMessage('Dependent price must be a array')
        ]
    }
    const customizeVariantUpdateValidate = (req,res) =>{
        return [
            check('varId')
                .notEmpty().withMessage('Varient required').bail()
                .isMongoId().withMessage('Not a valid varient value'),
            check('title')
                .notEmpty().withMessage('Title is required'),
            check('isDefault')
                .notEmpty().withMessage('Varient Default value required'),
            check('dependent_price')
                .isArray().withMessage('Dependent price must be a array')
        ]
    }
/* Menu Customize Items Validation end */
module.exports ={itemCreateValidate,itemUpdateValidate,itemCustomizeCreateValidate,itemCustomizeUpdateValidate,customizeVariantCreateValidate,customizeVariantUpdateValidate}