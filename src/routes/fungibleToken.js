const express = require('express')

const ftController = require('../controllers/fungibleToken')

const router = express.Router()

router.post(
  '/v1/ft/create', ftController.createFT
)
router.post(
  '/v1/ft/publish', ftController.publishFT
)
router.post(
  '/v1/ft/transfer', ftController.faucetAPI
)
router.get(
  '/v1/ft/token/:token', ftController.getFT
)
router.get(
  '/v1/ft/list/:address', ftController.listFungibleTokens
)
router.get(
  '/v1/ft/list/offchain/:address', ftController.listFungibleTokensOffchain
)
router.get(
  '/v1/ft/transaction/cashwallet', ftController.listTransactions
)
module.exports = router
