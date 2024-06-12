const mongoose = require('mongoose')
require('dotenv').config({ path: '.env' })

const connOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}
const MONGO_URI = process.env.MONGO_URI

const connectToDB = async () => {
  try {
    const connect = await mongoose.connect(MONGO_URI, connOptions)
    if (connect) console.log(`Mongodb connected - ${connect.connection.host}`)
  } catch (err) {
    console.log(`Database error ${err}`)
  }
}


module.exports = connectToDB
