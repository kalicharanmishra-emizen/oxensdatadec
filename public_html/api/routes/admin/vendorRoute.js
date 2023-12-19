const express = require('express');
const controller = require('../../controllers/admin/vendorController');
const { commonValidate } = require('../../helper');
const {verifyToken} = require('../../middleware/auth');
const validator = require('../../modules/admin/vendor-validate');
const router= express.Router();
/* Route Start */
    router.post('/list',verifyToken,controller.list)
    router.post('/edit',verifyToken,validator.getValidation(),commonValidate,controller.edit)
    router.post('/create',verifyToken,validator.createValidation(),commonValidate,controller.create)
    router.post('/update',verifyToken,validator.updateValidation(),commonValidate,controller.update)
/* Route End */
module.exports=router