const express = require('express');
const controller = require('../../controllers/driver/authController');
const { commonValidate } = require('../../helper');
const {varifyTokenDriver} = require('../../middleware/auth');
const validator = require('../../modules/driver/auth-validate');
const router= express.Router();

router.post('/signup',validator.signupValidation(),commonValidate,controller.signUp)
router.post('/login',validator.loginValidation(),commonValidate,controller.login)
router.post('/getProfile',varifyTokenDriver,controller.profile)
router.post('/update',varifyTokenDriver,validator.updateValidation(),commonValidate,controller.update)
router.post('/updateProfileImage',varifyTokenDriver,validator.changeProfileImageValidation(),commonValidate,controller.updateProfileImage)
router.post('/updatepassword',varifyTokenDriver,validator.changePassValidation(),commonValidate,controller.updatePass)
router.post('/online',varifyTokenDriver,controller.onlineStatus)
router.post('/storelocationlist',varifyTokenDriver,controller.storLocationList)
router.post('/forgot',controller.forgetPassword)
router.post('/reset',validator.resetValidate(),commonValidate,controller.resetPassword)
router.post('/udpateCurrentLocation',varifyTokenDriver,validator.currentLocationValidate(),commonValidate,controller.udpateDriverCurrentLocation)
/* verification route start */
router.post('/verification/send',varifyTokenDriver,validator.sendVerificationValidate(),commonValidate,controller.sendVerification)
// for app
router.post('/verification/verified',varifyTokenDriver,validator.verifiedVerificationValidate(),commonValidate,controller.verifiedVerification)
// for web
router.post('/verification/web/verified',controller.emailVarificationWeb)
/* verification route end */
module.exports = router