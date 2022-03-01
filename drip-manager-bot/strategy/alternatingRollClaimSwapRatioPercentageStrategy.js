const axios = require('axios');

let accounts = require('../../data/accounts.json');
const fs = require('fs');
const { modules } = require('web3');
const slippage = 1;

/**
 * alternatingRollClaimSwapRatioPercentageStrategy
 * Required parameters in accounts.json: thresholdPercentage, rollClaimRatio, rollClaimRatioCounter
 */

async function alternatingRollClaimSwapRatioPercentageStrategy(
    address,
    accountDetail,
    bnbBalanceInUSDT,
    claimsInUsdt,
    BNB_WALLET_MIN_VALUE
) {
    // (1) Find the account in accouns.json
    const account = accounts.find((x) => x.address === address);
    if (!account) {
        console.log(`Account not found`);
        return;
    }
    // (3) Check thresholdPercentage
    if (!accountDetail.thresholdPercentage) {
        console.log(`thresholdPercentage is not defined`);
        return;
    }
    // (4) Check rollClaimRatio
    if (!accountDetail.rollClaimRatio && isNaN(accountDetail.rollClaimRatio)) {
        console.log(`Invalid rollClaimRatio`);
        return;
    }
    // (5) Check rollClaimRatioCounter
    if (
        !accountDetail.rollClaimRatioCounter &&
        isNaN(accountDetail.rollClaimRatioCounter)
    ) {
        console.log(`Invalid rollClaimRatio`);
        return;
    }

    const requiredAvailableClaimPercentage =
        accountDetail.deposits * (accountDetail.thresholdPercentage / 100);
    console.log(
        `DRIP Deposits: ${accountDetail.deposits}, thresholdPercentage: ${accountDetail.thresholdPercentage}`
    );
    console.log(`Available Claims ${accountDetail.claims}`);
    console.log(
        `Required Available Claim (deposits * thresholdPercentage %): ${requiredAvailableClaimPercentage}`
    );
    console.log(
        `Roll Claim Ratio: ${accountDetail.rollClaimRatio}, Roll Counter: ${accountDetail.rollClaimRatioCounter}`
    );
    // (6) Perform alternatingRollClaimSwapRatioPercentageStrategy
    console.log(`Performing alternatingRollClaimSwapRatioPercentageStrategy`);
    if (bnbBalanceInUSDT >= BNB_WALLET_MIN_VALUE) {
        if (accountDetail.claims >= requiredAvailableClaimPercentage) {
            if (
                accountDetail.rollClaimRatioCounter <
                accountDetail.rollClaimRatio
            ) {
                const performRoll = await axios.get(
                    `http://localhost:3000/api/actions/roll?address=${address}`
                );
                if (performRoll && performRoll.data) {
                    console.log(`Roll Done. ${performRoll.data.message}`);
                    const value = accountDetail.rollClaimRatioCounter + 1;
                    // Update rollClaimRatioCounter
                    updateRollClaimRatioCounter(account, value);
                }
            } else {
                const performClaim = await axios.get(
                    `http://localhost:3000/api/actions/claim?address=${address}`
                );
                if (performClaim && performClaim.data) {
                    console.log(`Claim Done. ${performClaim.data.message}`);
                    // Update rollClaimRatioCounter
                    updateRollClaimRatioCounter(account, 0);
                    // (7) Refetch the account details before doing swap
                    const refetchedAccountDetail = await axios.get(
                        `http://localhost:3000/api/accounts/${address}`
                    );
                    const updatedAccountDetail = refetchedAccountDetail.data;
                    // (8) Perform swap after claim
                    const tokenSold = updatedAccountDetail.tokenBalance; // we always swap the maximum available token balance
                    const performSwap = await axios.get(
                        `http://localhost:3000/api/actions/swap?address=${address}&slippage=${slippage}&tokenSold=${tokenSold}`
                    );
                    if (performSwap && performSwap.data) {
                        console.log(`Swap Done. ${performSwap.data.message}`);
                    }
                }
            }
        } else {
            console.log(
                `Available Claims is less than the requiredAvailableClaimPercentage`
            );
        }
    } else {
        console.log(`Not enough BNB balance in wallet`);
    }
}

function updateRollClaimRatioCounter(account, value) {
    account.rollClaimRatioCounter = value;
    fs.writeFileSync(
        '../data/accounts.json',
        JSON.stringify(accounts, null, 2)
    );
}

module.exports = alternatingRollClaimSwapRatioPercentageStrategy;
