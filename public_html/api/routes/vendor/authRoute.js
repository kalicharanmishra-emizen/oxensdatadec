const express = require('express')
const controller = require('../../controllers/vendor/authController')
const { commonValidate } = require('../../helper')
const { verifyTokenVendor } = require('../../middleware/auth')
const validator = require('../../modules/vendor/auth-validate');
const router = express.Router()
/* route start */
router.post('/login',validator.loginValidate(),commonValidate,controller.login)
router.post('/getauthuser',verifyTokenVendor,controller.getAuthUser)
/* forget password routes start */
    router.post('/forgetpassword',validator.forgotValidate(),commonValidate,controller.forgetPassword)
    router.post('/resetpassword',validator.resetValidate(),commonValidate,controller.resetPassword)
/* forget password routes end */
/* profile routes start */
    router.post('/getprofile',verifyTokenVendor,controller.profile),
    router.post('/updategeneral',verifyTokenVendor,validator.generalValidate(),commonValidate,controller.updateGeneralProfile)
    router.post('/updatepassword',verifyTokenVendor,validator.passwordValidate(),commonValidate,controller.updatePassword)
    router.post('/updatevendortiming',verifyTokenVendor,controller.updateVendorTiming)
    router.post('/savevendorimages',verifyTokenVendor,validator.uploadImageValidate(),commonValidate,controller.saveVendorImages)
    router.post('/removevendorimages',verifyTokenVendor,controller.removeVendorImages)
/* profile routes end */
module.exports = router