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
const cashSchema = new mongoose.Schema({
   currencyToken: {
    type: String,
    required: true,
  },
  totalSupply: {
    type: Number,
    required: true,
  },
  currencyName: {
    type: String,
    required: true,
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

module.exports = mongoose.model('CashSchema', cashSchema)