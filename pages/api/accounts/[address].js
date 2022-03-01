let accounts = require('../../../data/accounts.json');
import Web3 from 'web3';
const drip_token_contract = require('../../../lib/drip-token-contract.json');
const drip_contract = require('../../../lib/drip-contract.json');

const DRIP_TOKEN_CONTRACT_ADDRESS =
    '0x20f663CEa80FaCE82ACDFA3aAE6862d246cE0333';
const DRIP_MAIN_CONTRACT_ADDRESS = '0xffe811714ab35360b67ee195ace7c10d93f89d8c';

import numberFormat from '../../../utils/numberFormat';

// Returns the account info base on the passed public address

export default async function handler(req, res) {
    const { address } = req.query;

    // initialize web3
    const BSC_NETWORK = 'https://bsc-dataseed.binance.org/';
    const web3 = new Web3(new Web3.providers.HttpProvider(BSC_NETWORK));

    // initialize contracts
    const dripTokenContract = new web3.eth.Contract(
        drip_token_contract,
        DRIP_TOKEN_CONTRACT_ADDRESS
    );

    const dripContract = new web3.eth.Contract(
        drip_contract,
        DRIP_MAIN_CONTRACT_ADDRESS
    );

    try {
        const account = accounts.find((obj) => {
            return obj.address === address;
        });

        if (account) {
            const bnbBalance = web3.utils.fromWei(
                await web3.eth.getBalance(address)
            );
            //console.log(bnbBalance);

            const dripTokenBalance = web3.utils.fromWei(
                await dripTokenContract.methods.balanceOf(address).call()
            );
            //console.log(dripTokenBalance);

            const accountInfo = await dripContract.methods
                .userInfo(address)
                .call();

            const accountTotals = await dripContract.methods
                .userInfoTotals(address)
                .call();

            const claimsAvailable = await dripContract.methods
                .claimsAvailable(address)
                .call();

            const isNetPositive = await dripContract.methods
                .isNetPositive(address)
                .call();

            const {
                total_deposits: deposits,
                airdrops_total: airdrops,
                total_payouts: claims,
            } = accountTotals;
            const user = await dripContract.methods.users(address).call();
            const { rolls } = user;
            const { toBN } = web3.utils;
            const netDeposits = toBN(deposits)
                .add(toBN(airdrops))
                .add(toBN(rolls))
                .sub(toBN(claims)); // deposits + airdrops + rolls - claims;

            const accountDetails = {
                // accounts.json
                id: account.id,
                accountname: account.accountname,
                address: account.address,
                walletLevel: account.walletLevel,
                rollCount: account.rollCount,

                // --- start strategies ----
                botStrategy: account.botStrategy,
                // continuousRollStrategy
                availableClaimDollarThreshold: account.availableClaimDollarThreshold,
                // alternatingRollClaimStrategy
                nextAction: account.nextAction,
                // alternatingRollClaimSwapPercentageStrategy
                thresholdPercentage: account.thresholdPercentage,
                // alternatingRollClaimSwapRatioPercentageStrategy
                rollClaimRatio: account.rollClaimRatio,
                rollClaimRatioCounter: account.rollClaimRatioCounter,
                // --- end strategies ----

                // bnb wallet
                bnbBalance: bnbBalance,
                bnbBalanceInUSDT: 'Computed from bnbBalance * bnbUsdt',

                // DRIP details
                tokenBalance: dripTokenBalance,
                
                deposits: accountInfo.deposits
                    ? web3.utils.fromWei(accountInfo.deposits)
                    : 0,
                depositsInUsdt: 'Computed from dripTokenBalance * bnbdripUsdt',

                claims: claimsAvailable
                    ? numberFormat(web3.utils.fromWei(claimsAvailable), 10)
                    : 0,
                claimsInUsdt: 'Computed from claims * bnbdripUsdt', 
                
                buddy: accountInfo.upline,
                directRewards: web3.utils.fromWei(accountInfo.direct_bonus),
                indirectRewards: web3.utils.fromWei(accountInfo.match_bonus),
                directs: accountTotals.referrals,
                team: accountTotals.total_structure,
                airDropSent: web3.utils.fromWei(accountTotals.airdrops_total),
                airDropReceived: web3.utils.fromWei(
                    accountTotals.airdrops_received
                ),
                isNetPositive: isNetPositive,
                netDeposits: web3.utils.fromWei(netDeposits.toString()),
            };
            res.status(200).send(accountDetails);
        } else {
            res.status(404).json({ message: 'Account not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(503).json({ message: "JSON RPC Error" });
    }
}

// Sample Responses
// Successful response
/* 
{
    "id": 1,
    "accountname": "Geric Main Account",
    "address": "0x92409dEAEC5a7ba48625BE43B41ffC3d7d4E8FBe",
    "walletLevel": 7,
    "rollCount": 4,
    "bnbBalance": "0.05374505",
    "bnbBalanceInUSDT": 0,
    "tokenBalance": "0.359759577106164582",
    "deposits": "1.739207386613002795",
    "claims": "0.9002336717",
    "buddy": "0x99148fEb343A7D000B26396c134236E65bed70f0",
    "directRewards": "0",
    "indirectRewards": "0",
    "directs": "0",
    "team": "0",
    "airDropSent": "0",
    "airDropReceived": "0",
    "isNetPositive": true,
    "netDeposits": "1.319162106383945043"
}
*/

// account not found response
/*
{
    "message": "Account not found"
}
*/

// error in bsc network, generi error
/*
{
    "message": "JSON RPC Error"
}
*/

// Code if we really want to check bsc connection. Not needed for now.
/*
const connected = await web3.eth.net.isListening();
if (connected) {
    console.log(`Connected to BSC network`);
    const account = getAccountDetails(web3, address);
    if (account) res.status(200).send(account);
    else res.status(200).json({ message: 'Account not found' });
} else {
    res.status(503).json({ message: 'Error connecting to BSC network' });
}
*/

