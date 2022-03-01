const axios = require('axios');

async function continuousRollStrategy(
    address,
    accountDetail,
    bnbBalanceInUSDT,
    claimsInUsdt,
    BNB_WALLET_MIN_VALUE
) {
    if (accountDetail.availableClaimDollarThreshold) {
        console.log(
            `availableClaimDollarThreshold: ${accountDetail.availableClaimDollarThreshold}`
        );
        if (bnbBalanceInUSDT >= BNB_WALLET_MIN_VALUE) {
            if (claimsInUsdt >= accountDetail.availableClaimDollarThreshold) {
                console.log(`Performing Auto Roll..`);
                const performRoll = await axios.get(
                    `http://localhost:3000/api/actions/roll?address=${address}`
                );
                if (performRoll && performRoll.data) {
                    console.log(`Auto Roll Done. ${performRoll.data.message}`);
                }
            } else {
                console.log(`Available Claims is less than the availableClaimDollarThreshold`);
            }
        } else {
            console.log(`Not enough BNB balance in wallet`);
        }
    } else {
        console.log(`Skipping, no availableClaimDollarThreshold defined`);
    }
}

module.exports = continuousRollStrategy;
