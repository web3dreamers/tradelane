const CustomError = require('../models/customError')
const algosdk = require('algosdk');
const sellOrderSchema = require('../models/listForSell')
require('dotenv').config({ path: '.env' })


const algodClient = new algosdk.Algodv2(process.env.ALGOD_TOKEN, process.env.ALGOD_SERVER, process.env.ALGOD_PORT);

const buyToken = async (req, res, next) => {

    try {
        console.log("[Buy] [buyToken] Starting ", req.body);

        sellOrder = await sellOrderSchema.findOne({ "sellId": req.body.sellId })
        if (!sellOrder) {
            return next(
                new CustomError('sellOrder does not exist for this id', 403)
            )
        }
        const assetId = sellOrder.assetIndex;
        const sellerPrice = sellOrder.price;
        const buyerToken = sellOrder.currencyIndex;
        const sellerQuantity = sellOrder.assetQuantity;
        const buyersQuantity = req.body.quantity;

        let params = await algodClient.getTransactionParams().do();

        // Create asset transfer transaction (NFT from seller to buyer)
        let assetTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
            sellerAccount.addr,
            buyerAccount.addr,
            undefined,
            undefined,
            buyersQuantity,
            undefined,
            assetId,
            params
        );

        // // Create payment transaction (Algos from buyer to seller)
        // let paymentTxn = algosdk.makePaymentTxnWithSuggestedParams(
        //     buyerAccount.addr,
        //     sellerAccount.addr,
        //     sellerPrice,
        //     undefined,
        //     undefined,
        //     params
        // );

         // Create custom token transfer transaction (custom tokens from buyer to seller)
        let customTokenTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
            buyerAccount.addr,
            sellerAccount.addr,
            undefined,
            undefined,
            sellerPrice,
            undefined,
            buyerToken,
            params
        );

        // Group transactions
        // let txnGroup = algosdk.assignGroupID([assetTransferTxn, paymentTxn]);
        let txnGroup = algosdk.assignGroupID([assetTransferTxn, customTokenTransferTxn]);


        // Sign transactions
        let signedAssetTransferTxn = assetTransferTxn.signTxn(sellerAccount.sk);
        // let signedPaymentTxn = paymentTxn.signTxn(buyerAccount.sk);
        let signedPaymentTxn = customTokenTransferTxn.signTxn(buyerAccount.sk);


        // Combine signed transactions
        let signedTxnGroup = [signedAssetTransferTxn, signedPaymentTxn];

        // Send the transaction
        let sendTx = await algodClient.sendRawTransaction(signedTxnGroup).do();
        console.log('Transaction ID: ', sendTx.txId);
    
        console.log(`Result : ${JSON.stringify(sendTx)}`);

        console.log("[Buy] [buyToken] Exiting ");
        res.send({
          ResponseCode: 200,
          ResponseMessage: "Buy order",
          Data: sendTx
        })
    }
    catch (err) {
        console.log("[Buy] [buyToken] Error ", err);
        next(new CustomError('Something went wrong', 500))
    }
}
module.exports = { buyToken }
