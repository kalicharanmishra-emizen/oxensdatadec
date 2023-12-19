const express = require('express');
const controller = require('../../controllers/admin/requestController');
// const { commonValidate } = require('../../helper');
const {verifyToken} = require('../../middleware/auth');
// const validator = require('../../modules/admin/user-validate');
const router= express.Router();

/* route Start */
    router.post('/contact',verifyToken,controller.contactUs)
    router.post('/career',verifyToken,controller.career)
    router.post('/becomestore',verifyToken,controller.becomeStore)
/* route End */
module.exports = router