const express = require('express')

const nftController = require('../controllers/nft')

const router = express.Router()

router.post(
  '/v1/nft/createmetadata', nftController.createMetadata
)
router.post(
  '/v1/nft/create', nftController.createNFT
)
router.post(
  '/v1/nft/publish', nftController.publishNFT
)
router.post(
  '/v1/nft/transfer', nftController.transferNFT
)
router.get(
  '/v1/nft/getmetadata/:id', nftController.getNFTMetadata
)
router.get(
  '/v1/nft/list/:address', nftController.listNonFungibleTokens
)
router.get(
  '/v1/nft/list/offchain/:address', nftController.listNFTOffchain
)
router.get(
  '/v1/nft/list/offers/:address', nftController.myOfferings
)
router.get(
  '/v1/ft/transaction/securitywallet', nftController.listTransactions
)
module.exports = router
