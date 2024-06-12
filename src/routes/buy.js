const express = require('express')

const nftController = require('../controllers/buyToken')

const router = express.Router()

router.post(
  '/v1/token/buy', nftController.buyToken
)
module.exports = router
