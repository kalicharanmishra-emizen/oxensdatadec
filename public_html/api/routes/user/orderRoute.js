const express = require('express')
const { varifyTokenUser } = require('../../middleware/auth')
const controller = require('../../controllers/user/orderController')
const validator = require('../../modules/user/front-validate');
const { commonValidate } = require('../../helper')
const router = express.Router()
/* route start */
router.post('/orderAllCharge',varifyTokenUser,controller.orderAllCharge)
router.post('/placeorder',varifyTokenUser,controller.placeOrder)
router.post('/myorder',varifyTokenUser,controller.myOrder)
router.post('/detail',varifyTokenUser,controller.detail)
router.post('/trackdetail',varifyTokenUser,controller.trackingDetail)
router.post('/create-payment-intent',varifyTokenUser,controller.payment)
router.post('/webhook', controller.webhook)
// router.post('/placeorder',varifyTokenUser,controller.placeOrder)
/* route end */
module.exports = router