const express = require('express')
const controller = require('../../controllers/admin/menuController')
const { commonValidate } = require('../../helper')
const {verifyToken} = require('../../middleware/auth');
const validator = require('../../modules/admin/menu-validate');
const router = express.Router()
/* Menu category route start */
    router.post('/category/list',verifyToken,controller.categoryList)
    router.post('/category/create',verifyToken,controller.categoryCreate)
    router.post('/category/detail',verifyToken,controller.categoryDetail)
    router.post('/category/update',verifyToken,controller.categoryUpdate)
/* Menu category route end */
/* Menu Items route start */
    router.post('/item/list',verifyToken,controller.itemList)
    router.post('/item/create',verifyToken,validator.itemCreateValidate(),commonValidate,controller.itemCreate)
    router.post('/item/detail',verifyToken,controller.itemDetail)
    router.post('/item/update',verifyToken,validator.itemUpdateValidate(),commonValidate,controller.itemUpdate)
    router.post('/item/status',verifyToken,controller.itemStatus)
    router.post('/item/delete',verifyToken,controller.itemDelete)
/* Menu Items route end */
/* Menu Item Customize route start */
    router.post('/customize/list',verifyToken,controller.itemCustomizeList)
    router.post('/customize/create',verifyToken,validator.itemCustomizeCreateValidate(),commonValidate,controller.itemCustomizeCreate)
    router.post('/customize/detail',verifyToken,controller.itemCustomeDetail)
    router.post('/customize/update',verifyToken,validator.itemCustomizeUpdateValidate(),commonValidate,controller.itemCustomizeUpdate)
    router.post('/customize/delete',verifyToken,controller.itemCustomizeDelete)
    router.post('/customize/status',verifyToken,controller.itemCustomizeStatus)
/* Menu Item Customize route end */
/* Menu Customize Items route start */
    router.post('/customize/variant/deplist',verifyToken,controller.depedentVarientList)
    router.post('/customize/variant/list',verifyToken,controller.customizeVariantList)
    router.post('/customize/variant/detail',verifyToken,controller.customizeVariantDetail)
    router.post('/customize/variant/create',verifyToken,validator.customizeVariantCreateValidate(),commonValidate,controller.customizeVariantCreate)
    router.post('/customize/variant/update',verifyToken,validator.customizeVariantUpdateValidate(),commonValidate,controller.customizeVariantUpdate)
    router.post('/customize/variant/delete',verifyToken,controller.customizeVariantDelete)
/* Menu Customize Items route end */

module.exports = router