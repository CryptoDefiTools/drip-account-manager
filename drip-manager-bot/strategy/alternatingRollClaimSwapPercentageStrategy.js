const axios = require('axios');

let accounts = require('../../data/accounts.json');
const fs = require('fs');
const { modules } = require('web3');
const slippage = 1;

/**
 *
 * alternatingRollClaimSwapPercentageStrategy
 * requiredAvailableClaimPercentage = dripdeposits * thresholdPercentage
 * Eg. 400 Drip Deposit * 1% = It will roll/claim when it hits 4 DRIP Tokens in available
 * After each transaction, Update nextAction and the threshold would be re-calculated.
 * Required parameters in accounts.json: thresholdPercentage
 *
 */
async function alternatingRollClaimSwapPercentageStrategy(
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
    // (2) Check nextAction
    if (!checkNextAction(accountDetail.nextAction)) {
        console.log(`Invalid nextAction.`);
    }
    // (3) Check thresholdPercentage
    if (!accountDetail.thresholdPercentage) {
        console.log(`thresholdPercentage is not defined`);
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
    // (4) Perform alternatingRollClaimSwapPercentageStrategy
    console.log(`Performing alternatingRollClaimSwapPercentageStrategy`);
    if (bnbBalanceInUSDT >= BNB_WALLET_MIN_VALUE) {
        if (accountDetail.claims >= requiredAvailableClaimPercentage) {
            if (accountDetail.nextAction === 'roll') {
                const performRoll = await axios.get(
                    `http://localhost:3000/api/actions/roll?address=${address}`
                );
                if (performRoll && performRoll.data) {
                    console.log(`Roll Done. ${performRoll.data.message}`);
                    updateNextAction(account);
                }
            } else if (accountDetail.nextAction === 'claim') {
                const performClaim = await axios.get(
                    `http://localhost:3000/api/actions/claim?address=${address}`
                );
                if (performClaim && performClaim.data) {
                    console.log(`Claim Done. ${performClaim.data.message}`);
                    updateNextAction(account);
                    // (6) Refetch the account details before doing swap
                    const refetchedAccountDetail = await axios.get(
                        `http://localhost:3000/api/accounts/${address}`
                    );
                    const updatedAccountDetail = refetchedAccountDetail.data;
                    // (7) Perform swap after claim
                    const tokenSold = updatedAccountDetail.tokenBalance; // we always swap the maximum available token balance
                    const performSwap = await axios.get(
                        `http://localhost:3000/api/actions/swap?address=${address}&slippage=${slippage}&tokenSold=${tokenSold}`
                    );
                    if (performSwap && performSwap.data) {
                        console.log(`Swap Done. ${performSwap.data.message}`);
                    }
                }
            } else {
                // This will only happen if the json file is modified during the transaction by the user.
                console.log(
                    `Invalid nextAction during alternatingRollClaimStrategy.`
                );
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

function checkNextAction(value) {
    if (!value) return false;
    if (value === 'roll') return true;
    if (value === 'claim') return true;
    return false;
}

// (5) Update Next Action in the accounts.json
function updateNextAction(account) {
    account.nextAction = setNextAction(account.nextAction);
    fs.writeFileSync(
        '../data/accounts.json',
        JSON.stringify(accounts, null, 2)
    );
}

function setNextAction(currentAction) {
    if (currentAction === 'roll') return 'claim';
    return 'roll';
}

module.exports = alternatingRollClaimSwapPercentageStrategy;
