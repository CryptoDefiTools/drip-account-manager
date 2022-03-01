let accounts = require('../../../data/accounts.json');
import Web3 from 'web3';
const fountain_contract = require('../../../lib/drip-fountain-contract.json');
const DRIP_FOUNTAIN_CONTRACT_ADDRESS =
    '0x4fe59adcf621489ced2d674978132a54d432653a';

export default async function handler(req, res) {
    const { address, tokenSold, slippage } = req.query;

    // Find and Load the Account by Address
    if (!address || !tokenSold)
        return res.status(400).json({ message: 'Invalid Request' });
    const account = accounts.find((acct) => acct.address === address);
    if (!account) res.status(404).json({ message: 'Account not found' });
    console.log(
        `Doing swap for address: ${address}, tokenSold: ${tokenSold}, slippage: ${slippage}%`
    );

    try {
        // initialize web3
        const BSC_NETWORK = 'https://bsc-dataseed.binance.org/';
        const web3 = new Web3(new Web3.providers.HttpProvider(BSC_NETWORK));
        // initialize drip fountain contract
        const fountainContract = new web3.eth.Contract(
            fountain_contract,
            DRIP_FOUNTAIN_CONTRACT_ADDRESS
        );
        // create in-memory wallet
        web3.eth.accounts.wallet.add(account.private);
        // Perform Swap Function
        const dripTokenToBnbPrice = await fountainContract.methods
            .getTokenToBnbInputPrice(web3.utils.toWei(tokenSold))
            .call();
        const toBN = web3.utils.toBN;
        const base1 = toBN(dripTokenToBnbPrice);
        const base2 = base1.mul(toBN(90)).div(toBN(100)); // TAX
        const base3 = base2.mul(toBN(100 - slippage)).div(toBN(100)); // 3% Slippage
        const min_bnb = base3.toString();
        console.log('Estimate BNB received:', web3.utils.fromWei(base2));
        console.log('Minimum BNB received:', web3.utils.fromWei(min_bnb));
        const gasPrice = await web3.eth.getGasPrice();
        const nonce = await web3.eth.getTransactionCount(address);
        const tx = fountainContract.methods.tokenToBnbSwapInput(
            web3.utils.toWei(tokenSold),
            min_bnb
        );
        const gas = await tx.estimateGas({ from: address });
        const data = tx.encodeABI();
        const txData = {
            from: address,
            to: DRIP_FOUNTAIN_CONTRACT_ADDRESS,
            data,
            gas,
            gasPrice,
            nonce,
            chainId: 56,
        };
        const receipt = await web3.eth.sendTransaction(txData);
        console.log(`Gas price: ${gasPrice}, Nonce: ${nonce}, Gas: ${gas}`);
        console.log('txReceipt', receipt);

        if (receipt && receipt.transactionHash) {
            const transactionMined = await web3.eth.getTransactionReceipt(
                receipt.transactionHash
            );
            if (transactionMined) {
                console.log(transactionMined);
                res.status(200).json({ message: 'Swap transaction mined' });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(503).json({ message: 'Swap Action Failed' });
    }
}
