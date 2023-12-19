const express = require('express');
const controller = require('../../controllers/admin/orderController');
// const { commonValidate } = require('../../helper');
const {verifyToken} = require('../../middleware/auth');
// const validator = require('../../modules/admin/cms-validate');
const router= express.Router();
/* route Start */
router.post('/list',verifyToken,controller.list)
router.post('/detail',verifyToken,controller.detail)
/* route End */
module.exports = router