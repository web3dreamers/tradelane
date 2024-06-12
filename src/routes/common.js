const express = require('express')

const commonController = require('../controllers/common')

const router = express.Router()

router.get(
  '/v1/token/list/:address', commonController.listTokens
)
router.post(
  '/v1/token/optin', commonController.optInAsset
)
router.post(
  '/v1/token/submit', commonController.submitTransaction
)
router.post(
  '/v1/account/create', commonController.createAccount
)
module.exports = router
