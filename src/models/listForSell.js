const mongoose = require('mongoose')
const blkSchema = new mongoose.Schema({
  trxnId: {
    type: String,
    required: false,
  },
  blockNumber: {
    type: String,
    required: Number,
  },
  chainId: {
    type: String,
    required: false,
  },
  initiatedBy:{
    type: String,
    required: false,
  },
  timestamp:{
      type: String,
      required: false,
  }
},{ _id : false })
const sellOrderSchema = new mongoose.Schema({
  sellId:{
    type: String,
    required: true,
    unique: true,
  },
   nftId: {
    type: String,
    required: true,
  },
  assetIndex: {
    type: Number,
    required: true,
  },
  assetSymbol: {
    type: String,
    required: true,
  },
  assetQuantity: {
    type: Number,
    required: true,
  },
  currencyIndex: {
    type: Number,
    required: false,
  },
  currencySymbol: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  sellerAddress: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  currencyOptions:{
    type: [{
      currencySymbol: String,
      currencyIndex: Number,
      price: Number
    }],
    required: false,
  },
  transaction :{
    type: blkSchema,
    required: false
  },
})

module.exports = mongoose.model('SellOrderSchema', sellOrderSchema)
