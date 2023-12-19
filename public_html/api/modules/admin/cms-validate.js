const { check } = require("express-validator")

/* Cms Vaidation start */
const updateValidate = (req,res) => {
    return [
        check('title').notEmpty().withMessage('Title is required'),
        check('slug').notEmpty().withMessage('Slug is required'),
        check('content').notEmpty().withMessage('Content is required')
    ]
}
/* Cms Vaidation start */

/* Reason Vaidation start */
    const reasonAddValidate = (req,res) => {
        return [
            check('title').notEmpty().withMessage('Title is required'),
            check('status').notEmpty().withMessage('Status is required'),
        ]
    }
    const reasonUpdateValidate = (req,res) => {
        return [
            check('_id')
                .notEmpty().withMessage('Reason is required').bail()
                .isMongoId().withMessage('Not a valid value'),
            check('title').notEmpty().withMessage('Title is required'),
            check('status').notEmpty().withMessage('Status is required'),
        ]
    }
    const reasonRemoveValidate = (req,res) => {
        return [
            check('_id')
                .notEmpty().withMessage('Reason is required').bail()
                .isMongoId().withMessage('Not a valid value'),
        ]
    }
/* Reason Vaidation end */
module.exports = {updateValidate, reasonAddValidate, reasonUpdateValidate, reasonRemoveValidate}