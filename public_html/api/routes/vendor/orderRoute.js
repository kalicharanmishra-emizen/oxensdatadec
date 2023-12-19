const express = require('express');
const controller = require('../../controllers/vendor/orderController');
// const { commonValidate } = require('../../helper');
const {verifyTokenVendor} = require('../../middleware/auth');
// const validator = require('../../modules/admin/cms-validate');
const router= express.Router();
/* route Start */
router.post('/list',verifyTokenVendor,controller.list)
router.post('/detail',verifyTokenVendor,controller.detail)
router.post('/activeOrder',verifyTokenVendor,controller.activeOrderList)
router.post('/orderStatusUpdate',verifyTokenVendor,controller.orderStatusUpdate)
/* route End */
module.exports = router