const express = require('express');
const controller = require('../../controllers/driver/homeController');
const { commonValidate } = require('../../helper');
const { varifyTokenDriver } = require('../../middleware/auth');
const validator = require('../../modules/driver/home-validate')

const router= express.Router();
/* income route start */
    router.post('/income/list',varifyTokenDriver,controller.incomeList)
/* income route end */
/* request route start */
    router.post('/request/reasonlist',varifyTokenDriver,validator.reasonListValidation(),commonValidate,controller.requestReasonList)
    router.post('/request/support',varifyTokenDriver,validator.requestSupportValidation(),commonValidate,controller.supportRequest)
    router.post('/request/reject',varifyTokenDriver,validator.orderRejectValidation(),commonValidate,controller.rejectRequest)
/* request route end */
/* notification route start */
    router.post('/notification/list',varifyTokenDriver,controller.notificationList)
    router.post('/notification/tokenUpdate',varifyTokenDriver,validator.fireBaseTokenValidation(),commonValidate,controller.updateFirbaseToken)
    router.post('/notification/status',varifyTokenDriver,validator.notificationStatusValidation(),commonValidate,controller.changeNotificationStatus)
/* notification route end */

module.exports = router