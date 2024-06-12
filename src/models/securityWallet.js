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

const securitySchema = new mongoose.Schema({
  securityType: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  issuer: {
    type: String,
    required: true,
  },
  underwriter: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stockTicker: {
    type: String,
    required: false,
  },
  artwork: {
    type: String,
    required: false,
  },
  region: {
    type: [String],
    required: true,
  },
  underlyingAssets: {
    type: String,
    required: false,
  },
  supportedCurrencies: {
    type: [String],
    required: true,
  },
  remarks: {
    type: String,
    required: true,
  },
  totalQty: {
    type: Number,
    required: true,
  },
  underwrittenQty: {
    type: Number,
    required: true,
  }
},{ _id : false })
const metadataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  image_mimetype: {
    type: String,
    required: true,
  },
  fields: {
    type: [securitySchema],
    required: true,
  }
},{ _id : false })
const nftSchema = new mongoose.Schema({
  assetId: {
    type: Number,
    required: false,
  },
  nftId: {
    type: String,
    required: true,
  },
  nftURL: {
    type: String,
    required: false,
  },
  metadata :{
    type: metadataSchema,
    required: true
  }, 
  status: {
    type: String,
    required: true,
  },
  transaction :{
    type: [blkSchema],
    required: false
  },
})

module.exports = mongoose.model('SecuritySchema', nftSchema)