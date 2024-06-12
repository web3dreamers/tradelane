const CustomError = require('../models/customError')
const algosdk = require('algosdk');
const sellOrderSchema = require('../models/listForSell')
const securitySchema = require('../models/securityWallet')

const utility = require('../utility/utils')

require('dotenv').config({ path: '.env' })

const algodClient = new algosdk.Algodv2(process.env.ALGOD_TOKEN, process.env.ALGOD_SERVER, process.env.ALGOD_PORT);

const createSellTokenOrder = async (req, res, next) => {

  console.log("[Sell] [listTokenForSell] Starting ", req.body);

  var { nftId, assetIndex,assetSymbol,assetQuantity,currencyOptions,sellerAddress } = req.body
  
  try {
    const sellId = utility.generateUniqueNumber("ID");
    const status = "Created"

    schemaDB = new sellOrderSchema({
      sellId,
      nftId,
      assetIndex,
      assetSymbol,
      assetQuantity,
      currencyOptions,
      sellerAddress,
      status
    })
    await schemaDB.save()
    console.log("[Sell] [listTokenForSell] Exiting ", schemaDB);
    res.send({
      ResponseCode: 200,
      ResponseMessage: "Sale order",
      Data: schemaDB
    })
  }
  catch (err) {
    console.log("[Sale] [listTokenForSell] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}
const publishSell = async (req, res, next) => {

  console.log("[Sell] [publishSell] Starting ", req.body);
  try {
    let schemaDBObj = await sellOrderSchema.findOne({ 'sellId' : req.body.sellId  })
       
    if(schemaDBObj == undefined || schemaDBObj == null){
      res.send({ 
        success: false, 
        message : "sellId not found",
        errors: "sellId not found"
      })
      return;
    }
    schemaDBObj.status = req.body.status;
    schemaDBObj.transaction.push(req.body.transaction);
    await schemaDBObj.save();
    console.log("[Sell] [publishSell] Docs ::  ", schemaDBObj);
    res.send({ 
      success: true, 
      message: schemaDBObj
   })
  }
  catch (err) {
    console.log("[Sell] [publishSell] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}
const listSellNFTs = async (req, res, next) => {

  console.log("[Sell] [listSellNFTs] Starting ", req.body);

  try {

    sellOrderSchema.find({})
    .then(function (docs) {
      console.log("[Sell] [listSellNFTs] Docs ::  ", docs);
      res.send({
        success: true,
        message: docs
      })
    })
    .catch(function (err) {
      console.log(err);
      res.send({
        success: false,
        message: "",
        errors: err
      })
    });

  }
  catch (err) {
    console.log("[Sell] [listSellNFTs] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}
const subscribe = async (req, res, next) => {

  console.log("[Sell] [subscribe] Starting ", req.body);

  try {
    var sellArray =[];
    var assetArray=[];
    var realEstateArray=[]
    var stockArray=[]
    var bondsArray=[]
    var artArray=[]
    var goldArray=[]
    const docs = await sellOrderSchema.find({'status':"Complete"});
      for(var i=0; i<docs.length; i++) {
        const sellOrder = docs[i];
        const mdocs = await securitySchema.find({'nftId':sellOrder.nftId});
        let orderDetails = JSON.parse(JSON.stringify(sellOrder));
        orderDetails['metadata'] = mdocs[0].metadata;
        console.log("Order type",orderDetails.metadata.fields[0].securityType)

        if(orderDetails.metadata.fields[0].securityType === "Tokenized Real Estate"){
          realEstateArray.push(orderDetails)
        }
        if(orderDetails.metadata.fields[0].securityType === "Tokenized Stocks"){
          stockArray.push(orderDetails)
        }
        if(orderDetails.metadata.fields[0].securityType === "Tokenized Bonds"){
          bondsArray.push(orderDetails)
        }
        if(orderDetails.metadata.fields[0].securityType === "Tokenized Art"){
          artArray.push(orderDetails)
        }
        if(orderDetails.metadata.fields[0].securityType === "Tokenized Digital Gold"){
          goldArray.push(orderDetails)
        }
        // sellArray.push(orderDetails)
      }
      assetArray.push({"tokentype":"Tokenized Stocks", "Tokens": stockArray});
      assetArray.push({"tokentype":"Tokenized Real Estate", "Tokens": realEstateArray});
      assetArray.push({"tokentype":"Tokenized Bonds", "Tokens": bondsArray});
      assetArray.push({"tokentype":"Tokenized Art", "Tokens": artArray});
      assetArray.push({"tokentype":"Tokenized Digital Gold", "Tokens": goldArray});

      console.log("[Sell] [subscribe] Docs ::  ", assetArray);
      res.send({
        success: true,
        message: assetArray
      })

  }
  catch (err) {
    console.log("[Sell] [subscribe] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}
const sellRequestsDetails = async (req, res, next) => {

  console.log("[Sell] [sellRequestsDetails] Starting ", req.body);

  try {
    var sellArray =[];
    const docs = await sellOrderSchema.find({'status':"Complete"});
      for(var i=0; i<docs.length; i++) {
        const sellOrder = docs[i];
        const mdocs = await securitySchema.find({'nftId':sellOrder.nftId});
        let orderDetails = JSON.parse(JSON.stringify(sellOrder));
        orderDetails['metadata'] = mdocs[0].metadata;
        sellArray.push(orderDetails)
      }
      console.log("[Sell] [sellRequestsDetails] Docs ::  ", sellArray);
      res.send({
        success: true,
        message: sellArray
      })
  }
  catch (err) {
    console.log("[Sell] [sellRequestsDetails] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}
const sellNFT = async (req, res, next) =>{
  let params = await algodClient.getTransactionParams().do();
  //check if escrow account is Optin if not do it
  // const accountInfo = await algodClient.accountInformation(escrowAccount.addr);
  //     if (accountInfo.assets && accountInfo.assets.find(asset => asset['asset-id'] === assetId)) {
  //         console.log(`Account ${escrowAccount.addr} is already opted in to asset ${assetId}.`);
  //         return;
  //     }

  //     const optInTxn = await algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
  //         from: escrowAccount.addr,
  //         to: escrowAccount.addr,
  //         params,
  //         assetId,
  //         amount: 0,
  //       });
  //       const optInSignedTxn = optInTxn.signTxn(escrowAccount.sk);
    
  //       await algodClient.sendRawTransaction(optInSignedTxn).do();
  //       const optInResult = await algosdk.waitForConfirmation(
  //         algodClient,
  //         optInTxn.txID().toString(),
  //         3
  //       );                
  //       console.log(`Result : ${JSON.stringify(optInResult)}`);


  // Create asset transfer transaction (NFT from seller to escrow)
  let assetTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
      sellerAccount.addr,
      escrowAccount.addr,
      undefined,
      undefined,
      1,
      undefined,
      assetId,
      params
  );

  const signedTxn = assetTransferTxn.signTxn(sellerAccount.sk);
  await algodClient.sendRawTransaction(signedTxn).do();
  const result = await algosdk.waitForConfirmation(
    algodClient,
    assetTransferTxn.txID().toString(),
    3
  );
  console.log(`Result : ${JSON.stringify(result)}`);
}

const getSellOrder = async (req, res, next) => {

  console.log("[Sell] [getSellOrder] Starting ", req.params.id);

  try {

    sellOrderSchema.find({'sellId': req.params.id})
    .then(function (docs) {
      console.log("[Sell] [getSellOrder] Docs ::  ", docs);
      res.send({
        success: true,
        message: docs
      })
    })
    .catch(function (err) {
      console.log(err);
      res.send({
        success: false,
        message: "",
        errors: err
      })
    });

  }
  catch (err) {
    console.log("[Sell] [getSellOrder] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}
const listTransactions = async (req, res, next) => {

  console.log("[Sell] [listTransactions] Starting ", req.body);

  try {
    sellOrderSchema.find({},{'transaction':true})
    .then(function (docs) {
      console.log("[Sell] [listTransactions] Docs ::  ", docs);
      res.send({
        success: true,
        message: docs
      })
    })
    .catch(function (err) {
      console.log(err);
      res.send({
        success: false,
        message: "",
        errors: err
      })
    });

  }
  catch (err) {
    console.log("[Sell] [listTransactions] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}
module.exports = {createSellTokenOrder, listSellNFTs,publishSell,getSellOrder,sellRequestsDetails,listTransactions, subscribe}
