const express = require('express')
const controller = require('../../controllers/user/authController')
const { commonValidate } = require('../../helper')
const { varifyTokenUser } = require('../../middleware/auth')
const validator = require('../../modules/user/auth-validate');
const router = express.Router()
/* route start */
router.post('/login',validator.loginValidate(),commonValidate,controller.login)
router.post('/signup',validator.signupValidate(),commonValidate,controller.signup)
router.post('/getauthuser',varifyTokenUser,controller.getAuthUser)
/* forget password routes start */
    router.post('/forgetpassword',validator.forgotValidate(),commonValidate,controller.forgetPassword)
    router.post('/resetpassword',validator.resetValidate(),commonValidate,controller.resetPassword)
/* forget password routes end */
/* profile routes start */
    router.post('/getprofile',varifyTokenUser,controller.profile),
    router.post('/updateprofile',varifyTokenUser,validator.generalValidate(),commonValidate,controller.updateProfile)
    router.post('/updatepassword',varifyTokenUser,validator.passwordValidate(),commonValidate,controller.updatePassword)
/* profile routes end */
module.exports = router