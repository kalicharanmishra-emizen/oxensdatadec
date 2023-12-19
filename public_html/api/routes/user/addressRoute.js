const express = require('express')
const controller = require('../../controllers/user/addressController')
const { commonValidate } = require('../../helper')
const { varifyTokenUser } = require('../../middleware/auth');
const validator = require('../../modules/user/address-validate');
const router = express.Router()
/* router Start */
    router.post('/list',varifyTokenUser,controller.list)
    router.post('/create',varifyTokenUser,validator.createValidate(),commonValidate,controller.create)
    router.post('/update',varifyTokenUser,validator.updateValidate(),commonValidate,controller.update)
    router.post('/destory',varifyTokenUser,validator.deleteValidate(),commonValidate,controller.destory)
/* router End */
module.exports = router

