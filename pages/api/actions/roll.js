let accounts = require('../../../data/accounts.json');
import Web3 from 'web3';
const drip_contract = require('../../../lib/drip-contract.json');
const DRIP_MAIN_CONTRACT_ADDRESS = '0xffe811714ab35360b67ee195ace7c10d93f89d8c';

export default async function handler(req, res) {
    const { address } = req.query;

    // Find and Load the Account by Address
    if (!address) res.status(400).json({ message: 'Invalid Request' });
    const account = accounts.find((acct) => acct.address === address);
    if (!account) res.status(404).json({ message: 'Account not found' });

    try {
        // initialize web3
        const BSC_NETWORK = 'https://bsc-dataseed.binance.org/';
        const web3 = new Web3(new Web3.providers.HttpProvider(BSC_NETWORK));
        // initialize drip contract
        const dripContract = new web3.eth.Contract(
            drip_contract,
            DRIP_MAIN_CONTRACT_ADDRESS
        );
        // create in-memory wallet
        web3.eth.accounts.wallet.add(account.private);
        // Perform Roll Function
        const gasPrice = await web3.eth.getGasPrice();
        const nonce = await web3.eth.getTransactionCount(address);
        const tx = dripContract.methods.roll();
        const gas = await tx.estimateGas({ from: address });
        const data = tx.encodeABI();

        const txData = {
            from: address,
            to: DRIP_MAIN_CONTRACT_ADDRESS,
            data,
            gas,
            gasPrice,
            nonce,
            chainId: 56,
        };

        const receipt = await web3.eth.sendTransaction(txData);
        console.log('gasPrice', gasPrice);
        console.log('nonce', nonce);
        console.log('gas: ', gas);
        console.log('txReceipt', receipt);

        if (receipt && receipt.transactionHash) {
            const transactionMined = await web3.eth.getTransactionReceipt(
                receipt.transactionHash
            );
            if (transactionMined) {
                console.log(transactionMined);
                // response
                res.status(200).json({message: 'Roll transaction mined'});
            }
        }
    } catch (error) {
        console.log(error);
        res.status(503).json({ message: 'Roll Action Failed' });
    }
}
