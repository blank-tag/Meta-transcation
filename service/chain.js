const { ethers } = require("ethers");
require("dotenv").config();

const fromWei = (num) => ethers.utils.formatEther(num);
const toWei = (num) => ethers.utils.parseEther(num.toString());

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const transferAmount = async (receiver, amount) => {
  return new Promise(async (resolve, reject) => {
    const balance = await provider.getBalance(wallet.address);
    console.log("balance :", balance.toString());

    if (balance.lt(toWei(amount))) {
      return reject({
        status: 400,
        message: "Insufficient balance to transfer",
      });
    }

    let transcation = {
      to: receiver,
      gasPrice: await provider.getGasPrice(),
      gasLimit: 21000,
      value: toWei(amount),
    };

    try {
      console.log("Starting.... ");
      const estimateCost = await calcualateGasPrice(provider, transcation);
      console.log("cost:", estimateCost.toString());

      transcation = {
        to: receiver,
        gasPrice: await provider.getGasPrice(),
        gasLimit: 21000,
        value: toWei((amount - fromWei(estimateCost)).toString()),
      };

      console.log(transcation);

      const signedTranscation = await wallet.sendTransaction(transcation);
      await signedTranscation.wait();
      console.log("completed");

      resolve({
        ...signedTranscation,
        status: "trasfer Completed",
        gasPrice: fromWei(transcation.gasPrice),
        gasLimit: transcation.gasLimit,
        totalGas: fromWei(estimateCost),
        transferAmount: (amount - fromWei(estimateCost)).toString(),
        explore: process.env.CHAIN_SCAN + signedTranscation.hash,
      });
    } catch (error) {
      reject({ ...error, status: 400 });
      console.log("here");
    }
  });
};

const calcualateGasPrice = async (provider, transcation) => {
  try {
    const gasLimit = await provider.estimateGas(transcation);
    return gasLimit;
  } catch (error) {
    return null;
  }
};

module.exports = { transferAmount };
