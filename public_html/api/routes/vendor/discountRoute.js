const express = require('express');
const controller = require('../../controllers/vendor/discountController');
const { commonValidate } = require('../../helper');
const {verifyTokenVendor} = require('../../middleware/auth');
const validator = require('../../modules/vendor/discount-validate');
const router= express.Router();
/* route Start */
router.post('/detail',verifyTokenVendor,controller.detail)
router.post('/update',verifyTokenVendor,validator.discountUpdateValidation(),commonValidate,controller.update)
/* route End */
module.exports = router