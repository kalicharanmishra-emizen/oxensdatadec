const express = require('express');
const controller = require('../../controllers/admin/userController');
const { commonValidate } = require('../../helper');
const {verifyToken} = require('../../middleware/auth');
const validator = require('../../modules/admin/user-validate');
const router= express.Router();
/* Route Start */
    router.post('/list',verifyToken,controller.list)
    router.post('/status',verifyToken,controller.status)
/* Route End */
module.exports=router