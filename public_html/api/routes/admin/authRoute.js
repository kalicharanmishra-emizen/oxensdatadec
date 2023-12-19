const express = require('express');
const controller = require('../../controllers/admin/authController');
const { commonValidate } = require('../../helper');
const {verifyToken} = require('../../middleware/auth');
const validator = require('../../modules/admin/auth-validate');

const router= express.Router();

router.post('/signup',validator.signupValidation(),commonValidate,controller.signUp)
router.post('/login',validator.loginValidation(),commonValidate,controller.login)
router.post('/profile',verifyToken,controller.profile)
router.post('/update',verifyToken,validator.updateValidation(),commonValidate,controller.update)
router.post('/updatePassword',verifyToken,validator.changePassValidation(),commonValidate,controller.updatePass)
router.post('/forgetpassword',validator.forgotValidate(),commonValidate,controller.forgetPassword)
router.post('/resetpassword',validator.resetValidate(),commonValidate,controller.resetPassword)
module.exports= router;