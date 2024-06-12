const CustomError = require('../models/customError')
const algosdk = require('algosdk');
const securitySchema = require('../models/securityWallet')
const utility = require('../utility/utils')
const fs = require('fs');
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATAKEY});

require('dotenv').config({ path: '.env' })

const algodClient = new algosdk.Algodv2(process.env.ALGOD_TOKEN, process.env.ALGOD_SERVER, process.env.ALGOD_PORT);

const createMetadata = async (req, res, next) => {

  console.log("[NFT] [createNFT] Starting ", req.body);
  var metadata = req.body;
  try {
    const nftId = utility.generateUniqueNumber("NFT");
    schemaDB = new securitySchema({
      "nftId": nftId,
      "metadata" : metadata,
      "status": "Draft"
    })
    await createFile(schemaDB.metadata);
    const stream = fs.createReadStream('./output.json');
    const response = await pinata.pinFileToIPFS(stream, {
      pinataMetadata: {
          name: "output.json"
      }
  })
  schemaDB.nftURL = "ipfs://" + response.IpfsHash
  await schemaDB.save()
      res.send({
      ResponseCode: 200,
      ResponseMessage: "Asset created",
      Data: schemaDB
    })
  }
  catch (err) {
    console.log("[NFT] [createNFT] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}
function createFile(json) {
  fs.writeFileSync('output.json', JSON.stringify(json));
}
const getNFTMetadata = async (req, res, next) => {
  try {
    console.log("[getNFT] [getNFT] Starting ",req.params.id);

    securitySchema.find({ 'nftId': req.params.id })
      .then(function (docs) {
        console.log("[getNFT] [getNFT] Docs ::  ", docs);
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
    console.log("[getNFT] [getNFT] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}
const publishNFT = async (req, res, next) => {

  console.log("[NFT] [publishNFT] Starting ", req.body);
  try {
    
    let schemaDBObj = await securitySchema.findOne({ 'nftId' : req.body.nftId  })
       
    if(schemaDBObj == undefined || schemaDBObj == null){
      res.send({ 
        success: false, 
        message : "nftId not found",
        errors: "nftId not found"
      })
      return;
    }
    schemaDBObj.status = req.body.status;
    schemaDBObj.assetId = req.body.assetId;
    schemaDBObj.transaction.push(req.body.transaction);
    await schemaDBObj.save();
    console.log("[NFT] [publishNFT] Docs ::  ", schemaDBObj);
    res.send({ 
      success: true, 
      message: schemaDBObj
   })
  }
  catch (err) {
    console.log("[NFT] [publishNFT] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}
const createNFT = async (req, res, next) => {

  console.log("[NFT] [createNFT] Starting ", req.body);
  try {
    const suggestedParams = await algodClient.getTransactionParams().do();
    console.log("[NFT] [createNFT] account", account.addr);
    const assetName = req.body.assetName + " @arc3";
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: account.addr,
      suggestedParams,
      defaultFrozen: false,
      unitName: "NFT",
      assetName: assetName,
      manager: account.addr,
      reserve: account.addr,
      freeze: account.addr,
      clawback: account.addr,
      assetURL: req.body.assetURL,
      total: req.body.totalSupply,
      decimals: 0
    });


    const signedTxn = txn.signTxn(account.sk);
    await algodClient.sendRawTransaction(signedTxn).do();
    const result = await algosdk.waitForConfirmation(
      algodClient,
      txn.txID().toString(),
      3
    );

    const assetIndex = result['asset-index'];
    console.log(`Asset ID created: ${assetIndex}`);
    res.send({
      ResponseCode: 200,
      ResponseMessage: "Asset created",
      Data: {
        "asset": assetIndex,
        "unitName": req.body.unitName,
        "assetName": req.body.assetName,
        "total": req.body.totalSupply
      }
    })
  }
  catch (err) {
    console.log("[NFT] [createNFT] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}
const transferNFT = async (req, res, next) => {
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
      amount: 1,
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
const listNonFungibleTokens = async (req, res, next) => {

  console.log("[nft] [listTokens] Starting ");
  try {
    let account_info = await algodClient.accountInformation(req.params.address).do();

    let acct_string = JSON.stringify(account_info);
    console.log("Account Info: " + acct_string);
    var assetArray = []
    for(let item of account_info["created-assets"]){
      if(item.params.url !== null && item.params.url !== undefined){
        var assetspx;
      for (const i in account_info['assets']) {
        if (account_info['assets'][i]['asset-id'] ==  item.index) {
          assetspx = account_info['assets'][i];
          // console.log("account_info['assets'][i]",account_info['assets'][i]);
        }
      }
    const docs = await securitySchema.find({ 'assetId': item.index });
    if (typeof docs !== 'undefined' && docs.length > 0) {
        var assetx = {
          "assetId": item.index,
          "unit":  item.params['unit-name'],
          "total":  item.params.total,
          "name": item.params['name'],
          "amount": assetspx.amount,
          "securities": docs[0].metadata.fields[0].securityType,
          "productName": docs[0].metadata.fields[0].productName,
          "issuer": docs[0].metadata.fields[0].issuer
        }
        
        assetArray.push(assetx); 
      }
    }
  }
  console.log("Item assetArray",assetArray);
    res.send({
      ResponseCode: 200,
      ResponseMessage: "List nft response",
      Data: assetArray
    })

  }
  catch (err) {
    console.log("[nft] [listTokens] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}
const listNFTOffchain = async (req, res, next) => {
  try {
    var assetArray=[]
  console.log("[NFT] [listNFTOffchain] Starting ");
  securitySchema.find({'transaction.initiatedBy':req.params.address})
    .then(function (docs) {
      let trans = JSON.parse(JSON.stringify(docs));
      var realEstateArray=[]
      var stockArray=[]
      var bondsArray=[]
      var artArray=[]
      var goldArray=[]


      for(var i =0;i<trans.length;i++){
        if(trans[i].metadata.fields[0].securityType === "Tokenized Real Estate"){
          realEstateArray.push(trans[i])
        }
        if(trans[i].metadata.fields[0].securityType === "Tokenized Stocks"){
          stockArray.push(trans[i])
        }
        if(trans[i].metadata.fields[0].securityType === "Tokenized Bonds"){
          bondsArray.push(trans[i])
        }
        if(trans[i].metadata.fields[0].securityType === "Tokenized Art"){
          artArray.push(trans[i])
        }
        if(trans[i].metadata.fields[0].securityType === "Tokenized Digital Gold"){
          goldArray.push(trans[i])
        }
      }
      assetArray.push({"tokentype":"Tokenized Stocks", "Tokens": stockArray});
      assetArray.push({"tokentype":"Tokenized Real Estate", "Tokens": realEstateArray});
      assetArray.push({"tokentype":"Tokenized Bonds", "Tokens": bondsArray});
      assetArray.push({"tokentype":"Tokenized Art", "Tokens": artArray});
      assetArray.push({"tokentype":"Tokenized Digital Gold", "Tokens": goldArray});

      console.log("[NFT] [listNFTOffchain] Docs ::  ", docs);
      res.send({
        success: true,
        message: assetArray
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
    console.log("[NFT] [listNFTOffchain] Exiting ");
  } catch (err) {
    console.log(err)
    next(new CustomError('Something went wrong', 500))
  }
}
const myOfferings = async (req, res, next) => {
  try {
  console.log("[NFT] [myOfferings] Starting ");
  securitySchema.find({'transaction.initiatedBy':req.params.address})
    .then(function (docs) {
      console.log("[NFT] [myOfferings] Docs ::  ", docs);
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
    console.log("[NFT] [listNFTOffchain] Exiting ");
  } catch (err) {
    console.log(err)
    next(new CustomError('Something went wrong', 500))
  }
}
const listTransactions = async (req, res, next) => {
  try {
  console.log("[NFT] [listTransactions] Starting ");
  securitySchema.find({},{'transaction':true})
    .then(function (docs) {
      var  list = [];
      let trans = JSON.parse(JSON.stringify(docs));
      for(var i =0;i<trans.length;i++){
        for(var j=0;j<trans[i].transaction.length;j++){
          list.push(trans[i].transaction[j]);
        }
      }
      console.log("[NFT] [listTransactions] Docs ::  ", docs);
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
    console.log("[NFT] [listTransactions] Exiting ");
  } catch (err) {
    console.log(err)
    next(new CustomError('Something went wrong', 500))
  }
}
module.exports = { createNFT, transferNFT,listNonFungibleTokens,createMetadata, getNFTMetadata,publishNFT,listNFTOffchain,listTransactions,myOfferings }
