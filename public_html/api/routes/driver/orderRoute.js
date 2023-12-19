const express = require('express');
const controller = require('../../controllers/driver/orderController');
const { commonValidate } = require('../../helper');
const { varifyTokenDriver } = require('../../middleware/auth');
const validator = require('../../modules/driver/order-validate')

const router= express.Router();
/* test route start */
router.post('/test',controller.testDriverAssign)
/* test route end */

router.post('/joblist',varifyTokenDriver,controller.assignJobList)
router.post('/jobAccpetReject',varifyTokenDriver,validator.jobAccpetRejectValidation(),commonValidate,controller.orderAccpetAndReject)
router.post('/pickupOrder',varifyTokenDriver,validator.pickupOrderValidation(),commonValidate,controller.pickupOrder)
router.post('/chnageOrderStatus',varifyTokenDriver,validator.orderStatusValidation(),commonValidate,controller.chnageOrderStatus)
router.post('/handleincoming',controller.callHandler)
router.post('/testdrivercron',controller.driverCron)


module.exports = router