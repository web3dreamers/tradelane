const CustomError = require('../models/customError')
const algosdk = require('algosdk');
const crypto = require('crypto');
var sha256 = require('sha256');
const cashSchema = require('../models/cashWallet');
const cashWallet = require('../models/cashWallet');
require('dotenv').config({ path: '.env' })
const algodClient = new algosdk.Algodv2(process.env.ALGOD_TOKEN, process.env.ALGOD_SERVER, process.env.ALGOD_PORT);

const createFT = async (req, res, next) => {

  console.log("[FT] [createFT] Starting ", req.body);

  var { currencyToken, currencyName, totalSupply, status } = req.body
  
  try {
    token = await cashSchema.findOne({currencyToken })
    if (token) {
      return next(
        new CustomError('currencyToken already exists', 403)
      )
    }
    schemaDB = new cashSchema({
      currencyToken,
      totalSupply,
      currencyName,
      status,
    })
    await schemaDB.save()
    console.log("[Schema] [createSchema] Exiting ", schemaDB);
    res.send({
      ResponseCode: 200,
      ResponseMessage: "Asset created",
      Data: schemaDB
    })
  }
  catch (err) {
    console.log("[FT] [createFT] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}
const faucetAPI = async (req, res, next) => {
  const ESCROW_PKEY = process.env.ESCROW_PKEY
  const escrowAccount = algosdk.mnemonicToSecretKey(ESCROW_PKEY);
  console.log("[FT] [faucetAPI] Starting ", req.body);
  try {
 
    const suggestedParams = await algodClient.getTransactionParams().do();

    const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: escrowAccount.addr,
      to: req.body.to,
      suggestedParams,
      assetIndex:req.body.assetIndex,
      amount: req.body.amount,
    });

    const signedTxn = optInTxn.signTxn(escrowAccount.sk);
    await algodClient.sendRawTransaction(signedTxn).do();
    const result = await algosdk.waitForConfirmation(
      algodClient,
      optInTxn.txID().toString(),
      3
    );
  console.log("TXID", optInTxn.txID());
  console.log(`Result : ${JSON.stringify(result)}`);
  res.send({
    ResponseCode: 200,
    ResponseMessage: "Asset transferred",
    Data: {
      "asset": req.body.assetIndex,
      "amount": req.body.amount,
      "to": req.body.to,
    }
  })
}
 
 
    catch (err) {
    console.log("[FT] [createFT] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}

// const createTokenAPI = async (req, res, next) => {

//   console.log("[FT] [createFT] Starting ", req.body);
//   try {
//     const suggestedParams = await algodClient.getTransactionParams().do();
//     console.log("[FT] [createFT] account", account.addr);

//     const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
//       from: account.addr,
//       suggestedParams,
//       defaultFrozen: false,
//       unitName: req.body.unitName,  
//       assetName: req.body.assetName,
//       manager: account.addr,
//       reserve: account.addr,
//       freeze: account.addr,
//       clawback: account.addr,
//       total: req.body.totalSupply,
//       decimals: 0
//     });


//     const signedTxn = txn.signTxn(account.sk);
//     await algodClient.sendRawTransaction(signedTxn).do();
//     const result = await algosdk.waitForConfirmation(
//       algodClient,
//       txn.txID().toString(),
//       3
//     );

//     const assetIndex = result['asset-index'];
//     console.log(`Asset ID created: ${assetIndex}`);
//     res.send({
//       ResponseCode: 200,
//       ResponseMessage: "Asset created",
//       Data: {
//         "asset": assetIndex,
//         "unitName": req.body.unitName,
//         "assetName": req.body.assetName,
//         "total": req.body.totalSupply
//       }
//     })
//   }
//   catch (err) {
//     console.log("[FT] [createFT] Error ", err);
//     next(new CustomError('Something went wrong', 500))
//   }
// }
const publishFT = async (req, res, next) => {

  console.log("[FT] [createFT] Starting ", req.body);
  try {
    
    let schemaDBObj = await cashSchema.findOne({ 'currencyToken' : req.body.currencyToken  })
       
    if(schemaDBObj == undefined || schemaDBObj == null){
      res.send({ 
        success: false, 
        message : "currencyToken not found",
        errors: "currencyToken not found"
      })
      return;
    }
    schemaDBObj.status = req.body.status;
    schemaDBObj.transaction.push(req.body.transaction);
    await schemaDBObj.save();
    console.log("[Schema] [publishSchema] Docs ::  ", schemaDBObj);
    res.send({ 
      success: true, 
      message: schemaDBObj
   })
  }
  catch (err) {
    console.log("[FT] [createFT] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}
const getFT = async (req, res, next) => {

  try {
    console.log("[getFT] [getFT] Starting ");

    cashSchema.find({ 'currencyToken': req.params.token })
      .then(function (docs) {
        console.log("[Schema] [getFT] Docs ::  ", docs);
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
    console.log("[FT] [createFT] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}
const listFungibleTokens = async (req, res, next) => {

  console.log("[common] [listTokens] Starting ");
  try {
    let account_info = await algodClient.accountInformation(req.params.address).do();

    let acct_string = JSON.stringify(account_info);
    console.log("Account Info: " + acct_string);
    var assetArray = []
    for(let item of account_info["created-assets"]){
      if( item.params.url === undefined || item.params.url === null){
        
      var assetspx;
      for (const i in account_info['assets']) {
        if (account_info['assets'][i]['asset-id'] ==  item.index) {
          assetspx = account_info['assets'][i];
          // console.log("account_info['assets'][i]",account_info['assets'][i]);
        }
      }
      var assetx = {
        "assetIndex": item.index,
        "unit":  item.params['unit-name'],
        "total":  item.params.total,
        "name": item.params['name'],
        "amount": assetspx.amount
      }
      assetArray.push(assetx); 

    }
    console.log("Item assetArray",assetArray);

  }
    res.send({
      ResponseCode: 200,
      ResponseMessage: "List response",
      Data: assetArray
    })

  }
  catch (err) {
    console.log("[common] [listTokens] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}
const listTransactions = async (req, res, next) => {
  try {
  console.log("[FT] [listTransactions] Starting ");
  cashSchema.find({},{'transaction':true})
    .then(function (docs) {
      var  list = [];
      let trans = JSON.parse(JSON.stringify(docs));
      for(var i =0;i<trans.length;i++){
        for(var j=0;j<trans[i].transaction.length;j++){
          list.push(trans[i].transaction[j]);
        }
      }
      console.log("[FT] [listTransactions] Docs ::  ", docs);
      res.send({
        success: true,
        message: list
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
    console.log("[FT] [listTransactions] Exiting ");
  } catch (err) {
    console.log(err)
    next(new CustomError('Something went wrong', 500))
  }
}
const listFungibleTokensOffchain = async (req, res, next) => {
  try {
  console.log("[FT] [listFungibleTokensOffchain] Starting ");
  cashSchema.find({'transaction.initiatedBy':req.params.address})
    .then(function (docs) {
      console.log("[FT] [listFungibleTokensOffchain] Docs ::  ", docs);
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
    console.log("[FT] [listFungibleTokensOffchain] Exiting ");
  } catch (err) {
    console.log(err)
    next(new CustomError('Something went wrong', 500))
  }
}
const transferFT = async (req, res, next) => {
  try {
    console.log("[common] [optInAsset] Starting ", req.body);

    const assetIndex = req.body.assetIndex;
    console.log("[common] [optInAsset] account2.addr ", account2.addr);
    console.log("[common] [optInAsset] assetIndex ", assetIndex);
    
    const suggestedParams = await algodClient.getTransactionParams().do();

    const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: account.addr,
      to: req.body.to,
      suggestedParams,
      assetIndex,
      amount: req.body.amount,
    });

    const signedTxn = optInTxn.signTxn(account.sk);
    await algodClient.sendRawTransaction(signedTxn).do();
    const result = await algosdk.waitForConfirmation(
      algodClient,
      optInTxn.txID().toString(),
      3
    );

  console.log(`Result : ${JSON.stringify(result)}`);
  res.send({
    ResponseCode: 200,
    ResponseMessage: "Asset transferred",
    Data: {
      "asset": assetIndex,
      "amount": req.body.amount,
      "to": req.body.to,
    }
  })
  }catch (e) {
      console.log(e);
      next(new CustomError(e.response.body.message, 500));
  }
}
module.exports = { createFT,transferFT,listFungibleTokens,getFT,publishFT ,listFungibleTokensOffchain, listTransactions,faucetAPI}
