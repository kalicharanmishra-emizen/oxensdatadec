const express = require('express')
const controller = require('../../controllers/user/frontController')
const { commonValidate } = require('../../helper')
const { varifyTokenUser } = require('../../middleware/auth')
const validator = require('../../modules/user/front-validate');
const router = express.Router()
/* route start */
router.post('/contactus',validator.contactUsValidate(),commonValidate,controller.contactUs)
router.post('/cms',controller.cms)
router.post('/becomestore',validator.becomeStoreValidate(),commonValidate,controller.becomeAStore)
router.post('/career',validator.careerValidate(),commonValidate,controller.career)
router.post('/search',controller.search)
router.post('/getlatlng',controller.getLatlng)
/* route end */
module.exports = router