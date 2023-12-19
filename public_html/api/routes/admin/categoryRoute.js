const express = require('express')
const controller = require('../../controllers/admin/categoryController')
const { commonValidate } = require('../../helper')
const {verifyToken} = require('../../middleware/auth')
const validator = require('../../modules/admin/category-validate')

const router = express.Router();
/* routes fo category types  start */
router.post('/type/list',verifyToken,controller.listType)
router.post('/type/create',verifyToken,validator.addTypeValidate(),commonValidate,controller.addType)
/* routes fo category types  end */
/* routes fo category  start */
router.post('/list',verifyToken,controller.categoryList)
router.post('/create',verifyToken,validator.createCategoryValidation(),commonValidate,controller.categoryCreate)
router.post('/detail',verifyToken,validator.detailCategoryValidation(),commonValidate,controller.categoryDetail)
router.post('/update',verifyToken,validator.updateCategoryValidation(),commonValidate,controller.categoryUpdate)
router.post('/delete',verifyToken,controller.ctegoryDelete)
/* routes fo category  end */
module.exports = router