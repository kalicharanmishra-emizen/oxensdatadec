const express = require('express');
const controller = require('../../controllers/vendor/storeController');
// const { commonValidate } = require('../../helper');
const {verifyTokenVendor} = require('../../middleware/auth');
// const validator = require('../../modules/admin/cms-validate');
const router= express.Router();
/* route Start */
router.post('/list',verifyTokenVendor,controller.reviewlist)
router.post('/help',verifyTokenVendor,controller.helplist)
router.post('/filterlisting',verifyTokenVendor,controller.filterList)
router.post('/detail',verifyTokenVendor,controller.details)
router.post('/productlist', verifyTokenVendor,controller.productList)
router.post('/orderAllCharge', verifyTokenVendor,controller.orderAllCharge)
router.post('/placeorder', verifyTokenVendor,controller.placeOrder)
router.post('/createPOSuser', verifyTokenVendor,controller.createPOSuser)
router.post('/posuser', verifyTokenVendor,controller.searchPOSuser)
router.post('/posOrder', verifyTokenVendor,controller.posOrders)
router.post('/posdetail', verifyTokenVendor,controller.detail)
/* route End */
module.exports = router