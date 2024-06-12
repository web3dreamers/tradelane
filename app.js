const express = require('express')
var cors = require('cors');
const ftToken = require('./src/routes/fungibleToken')
const nftToken = require('./src/routes/nft')
const token = require('./src/routes/common')
const sell = require('./src/routes/sell')
const buy = require('./src/routes/buy')
const user = require('./src/routes/user')


const errorMiddleware = require('./src/middleware/error')
const customError = require('./src/models/customError')

const connectToDatabase = require('./src/database/dbConfig')
const app = express()
require('dotenv').config({ path: '.env' })

//express middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(cors());
app.options('*', cors())
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cotrust-Orgid");


  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);


  //decrypt token get role authMethod to check with input token and role.

  // Pass to next layer of middleware
  next();

});

app.use('/health', (req, res) => {
  res.status(200).json({
    success: true,
    Message: "Server is up",
  })
})


app.use(express.static('public'))

app.use('/api/', ftToken)
app.use('/api/', nftToken)
app.use('/api/', token)
app.use('/api/', sell)
app.use('/api/', buy)
app.use('/api/', user)



app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    errors: [
      {
        msg: 'Route not found',
      },
    ],
  })
})
function authHeaderChecker(req, res, next) {
  console.log("req.headers.cotrustOrgId ",req.headers.cotrustorgid);
  if (req.headers.cotrustorgid != undefined) {
      next();
  } else {
    return next(
      new CustomError('Please provide cotrustorgid in headers', 503)
    )
  }
}
app.use(errorMiddleware)
const PORT = process.env.PORT

connectToDatabase().then(_ => {
  app.listen(PORT, _ => {
    console.log(`Server started on port ${PORT}`)
  })
})