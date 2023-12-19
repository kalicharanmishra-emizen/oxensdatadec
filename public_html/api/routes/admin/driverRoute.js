const express = require('express');
const controller = require('../../controllers/admin/driverController');
// const { commonValidate } = require('../../helper');
const {verifyToken} = require('../../middleware/auth');
// const validator = require('../../modules/admin/user-validate');
const router= express.Router();
/* Route Start */
    router.post('/list',verifyToken,controller.list)
    router.post('/detail',verifyToken,controller.detail)
    router.post('/status',verifyToken,controller.status)
    router.post('/driverIncome',verifyToken,controller.driverIncomeList)
    router.post('/driverJobs',verifyToken,controller.driverJobList)
/* Route End */
module.exports=router