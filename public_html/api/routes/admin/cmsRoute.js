const express = require('express');
const controller = require('../../controllers/admin/cmsController');
const { commonValidate } = require('../../helper');
const {verifyToken} = require('../../middleware/auth');
const validator = require('../../modules/admin/cms-validate');
const router= express.Router();

/* route Start */
    router.post('/list',verifyToken,controller.list)
    router.post('/detail',verifyToken,controller.detail)
    router.post('/update',verifyToken,validator.updateValidate(),commonValidate,controller.update)
    /* Rider Support route start */
        router.post('/ridersupport/list',verifyToken,controller.riderSupportList)
        router.post('/ridersupport/add',verifyToken,validator.reasonAddValidate(),commonValidate,controller.riderSupportAdd)
        router.post('/ridersupport/update',verifyToken,validator.reasonUpdateValidate(),commonValidate,controller.riderSupportUpdate)
        router.post('/ridersupport/remove',verifyToken,validator.reasonRemoveValidate(),commonValidate,controller.riderSupportRemove)
    /* Rider Support route end */
    /* Order reject reason route start */
        router.post('/rejectreason/list',verifyToken,controller.rejectReasonList)
        router.post('/rejectreason/add',verifyToken,validator.reasonAddValidate(),commonValidate,controller.rejectReasonAdd)
        router.post('/rejectreason/update',verifyToken,validator.reasonUpdateValidate(),commonValidate,controller.rejectReasonUpdate)
        router.post('/rejectreason/remove',verifyToken,validator.reasonRemoveValidate(),commonValidate,controller.rejectReasonRemove)
    /* Order reject reason route end */
    /* dashboard data start */
        router.post('/dashboard',verifyToken,controller.dashboardData)
    /* dashboard data end */
/* route End */
module.exports = router