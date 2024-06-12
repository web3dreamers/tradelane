const mongoose = require('mongoose')
const contractSchema = new mongoose.Schema({
  contractName: {
    type: String,
    required: true,
    unique: true,
  },
  contractAddress: {
    type: String,
    required: true,
    unique: true,
  },
  ABI: {
    type: [Object],
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('ContractMap', contractSchema)
