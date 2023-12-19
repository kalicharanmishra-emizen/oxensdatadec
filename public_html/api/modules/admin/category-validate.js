const { check } = require("express-validator")
const Category = require("../../models/categoryModel")

/* category type validation start */
const addTypeValidate = (req,res) => {
    return [
        check('title').notEmpty().withMessage('Title is required')
    ]
}
/* category type validation end */

/* category  validation start */

    const createCategoryValidation = (req,res) => {
        return [
            check('title')
                .notEmpty().withMessage('Title is required').bail()
                .custom((title,{req})=>{
                    return Category.findOne({title:{ $regex: new RegExp(title,'i') }}).then(result => {
                        if (result) {
                             return Promise.reject('Category Already Exist');     
                        } 
                     })
                })
                ,
            check('type')
                .notEmpty().withMessage('Type is required').bail()
                .isMongoId().withMessage('Not a valid value'),
        ]
    }
    const detailCategoryValidation = (req,res) => {
        return [
            check('categoryId')
            .notEmpty().withMessage('Select a category').bail()
            .isMongoId().withMessage('Not a valid category id')
        ]
    }
    
    const updateCategoryValidation = (req,res) => {
        return [
            check('title').notEmpty().withMessage('Title is required').bail(),
            check('categoryId')
                .notEmpty().withMessage('Category ID is required').bail()
                .isMongoId().withMessage('Not a valid value'),
        ]
    }
    

/* category  validation End */
module.exports = {addTypeValidate,createCategoryValidation,detailCategoryValidation,updateCategoryValidation}