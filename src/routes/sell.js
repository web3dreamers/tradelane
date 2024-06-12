const express = require('express')

const nftController = require('../controllers/listForSell')

const router = express.Router()

router.post(
  '/v1/token/sell', nftController.createSellTokenOrder
)
router.get(
  '/v1/token/sell/list', nftController.listSellNFTs
)
router.put(
  '/v1/token/sell/publish', nftController.publishSell
)
router.get(
  '/v1/token/sell/requests', nftController.sellRequestsDetails
)
router.get(
  '/v1/token/sell/transactions', nftController.listTransactions
)
router.get(
  '/v1/token/sell/subscribe', nftController.subscribe
)
router.get(
  '/v1/token/sell/:id', nftController.getSellOrder
)


module.exports = router
