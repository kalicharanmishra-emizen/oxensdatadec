const express = require('express')
const controller = require('../../controllers/user/storeController')
const { commonValidate } = require('../../helper')
const validator = require('../../modules/user/auth-validate');
const router = express.Router()
/* route start */
router.post('/filterlisting',controller.filterList)
router.post('/listing',controller.listing)
router.post('/detail',controller.details)
router.post('/productlist',controller.productList)
router.post('/storerating',controller.storerating)
module.exports = router