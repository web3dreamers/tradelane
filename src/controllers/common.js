const CustomError = require('../models/customError')
const algosdk = require('algosdk');
require('dotenv').config({ path: '.env' })

const algodClient = new algosdk.Algodv2(process.env.ALGOD_TOKEN, process.env.ALGOD_SERVER, process.env.ALGOD_PORT);

const listTokens = async (req, res, next) => {

  console.log("[common] [listTokens] Starting ");
  try {
    let account_info = await algodClient.accountInformation(req.params.address).do();

    let acct_string = JSON.stringify(account_info);
    console.log("Account Info: " + acct_string);
    res.send({
      ResponseCode: 200,
      ResponseMessage: "List response",
      Data: {
        "address": account_info.address,
        "createdAssets": account_info["created-assets"],
        "assets": account_info.assets,
        "total-assets-opted-in": account_info["total-assets-opted-in"],
        "total-created-assets": account_info["total-created-assets"]
      }
    })

  }
  catch (err) {
    console.log("[common] [listTokens] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}

const optInAsset = async (req, res, next) => {
  try {
    console.log("[common] [optInAsset] Starting ", req.body);

    const assetIndex = req.body.assetId;
    const accountAddress = req.body.address;

    // const accountAddress = req.headers['address'];
    console.log("[common] [optInAsset] assetIndex ", assetIndex);

    const suggestedParams = await algodClient.getTransactionParams().do();
  
    const optInTxn = await algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: accountAddress,
      to: accountAddress,
      suggestedParams,
      assetIndex,
      amount: 0,
    });
    
    // console.log("optInTxn",optInTxn);
  
    // const signedTxn = optInTxn.signTxn(account2.sk);

    // await algodClient.sendRawTransaction(signedTxn).do();
    // const result = await algosdk.waitForConfirmation(
    //   algodClient,
    //   optInTxn.txID().toString(),
    //   3
    // );  
    // console.log(`Result : ${JSON.stringify(result)}`);

    res.send({
        ResponseCode: 200,
        ResponseMessage: "OptIn response",
        Data: optInTxn
      })
}
  catch (err) {
    console.log("[common] [optInAsset] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}

const submitTransaction = async (req, res, next) => {
  try {
    console.log("[common] [submitTransaction] Starting ", req.body.signature);

    const signedTxn = req.body.signature;

    await algodClient.sendRawTransaction(signedTxn).do();
    const result = await algosdk.waitForConfirmation(
      algodClient,
      optInTxn.txID().toString(),
      3
    );
    console.log(`Result : ${JSON.stringify(result)}`);
    res.send({
        ResponseCode: 200,
        ResponseMessage: "Transaction response",
        Data: result
      })
}
  catch (err) {
    console.log("[common] [submitTransaction] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}
const createAccount = async (req, res, next) => {
  console.log("[common] [createAccount] Starting ");
  try {
    let account = algosdk.generateAccount();
    console.log("[common] [createAccount] Account Address: ", account.addr);

    let mn = algosdk.secretKeyToMnemonic(account.sk);
    console.log("[common] [createAccount] Account Mnemonic: ", mn);
   
    res.send({
      ResponseCode: 200,
      ResponseMessage: "List response",
      Data: {
        "address": account.addr,
        "privateKey": mn
      }
    })
    
  }
  catch (err) {
    console.log("[common] [listTokens] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}

module.exports = { listTokens, optInAsset, submitTransaction ,createAccount}
