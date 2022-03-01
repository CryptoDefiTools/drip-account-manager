const axios = require('axios');

let accounts = require('../../data/accounts.json');
const fs = require('fs');

async function alternatingRollClaimStrategy(
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
    // (3) Check availableClaimDollarThreshold
    if (!accountDetail.availableClaimDollarThreshold) {
        console.log(`availableClaimDollarThreshold is not refined`);
        return;
    }
    console.log(
        `availableClaimDollarThreshold: ${accountDetail.availableClaimDollarThreshold}`
    );
    // (4) Perform alternatingRollClaimStrategy
    console.log(`Performing alternatingRollClaimStrategy`);
    if (bnbBalanceInUSDT >= BNB_WALLET_MIN_VALUE) {
        if (claimsInUsdt >= accountDetail.availableClaimDollarThreshold) {
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
                }
            } else {
                // This will only happen if the json file is modified during the transaction by the user.
                console.log(
                    `Invalid nextAction during alternatingRollClaimStrategy.`
                );
            }
        } else {
            console.log(
                `Available Claims is less than the availableClaimDollarThreshold`
            );
        }
    } else {
        console.log(`Not enough BNB balance in wallet`);
    }
}

// (5) Update Next Action in the accounts.json
function updateNextAction(account) {
    account.nextAction = setNextAction(account.nextAction);
    fs.writeFileSync(
        '../data/accounts.json',
        JSON.stringify(accounts, null, 2)
    );
}

function checkNextAction(value) {
    if (!value) return false;
    if (value === 'roll') return true;
    if (value === 'claim') return true;
    return false;
}

function setNextAction(currentAction) {
    if (currentAction === 'roll') return 'claim';
    return 'roll';
}

module.exports = alternatingRollClaimStrategy;
