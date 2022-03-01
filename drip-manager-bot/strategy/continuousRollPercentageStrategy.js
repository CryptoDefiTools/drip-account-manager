const axios = require('axios');

async function continuousRollPercentageStrategy(
    address,
    accountDetail,
    bnbBalanceInUSDT,
    claimsInUsdt,
    BNB_WALLET_MIN_VALUE
) {
    if (accountDetail.thresholdPercentage) {
        const requiredAvailableClaimPercentage =
            accountDetail.deposits * (accountDetail.thresholdPercentage / 100);
        console.log(
            `DRIP Deposits: ${accountDetail.deposits}, thresholdPercentage: ${accountDetail.thresholdPercentage}`
        );
        console.log(`Available Claims ${accountDetail.claims}`);
        console.log(
            `Required Available Claim (deposits * thresholdPercentage %): ${requiredAvailableClaimPercentage}`
        );

        if (bnbBalanceInUSDT >= BNB_WALLET_MIN_VALUE) {
            if (accountDetail.claims >= requiredAvailableClaimPercentage) {
                console.log(`Performing Auto Roll..`);
                const performRoll = await axios.get(
                    `http://localhost:3000/api/actions/roll?address=${address}`
                );
                if (performRoll && performRoll.data) {
                    console.log(`Auto Roll Done. ${performRoll.data.message}`);
                }
            } else {
                console.log(
                    `Available Claims is less than the requiredAvailableClaimPercentage`
                );
            }
        } else {
            // console.log(`Not enough BNB balance in wallet`);
            if (accountDetail.claims >= requiredAvailableClaimPercentage) {
                // claim and swap
                console.log(`Performing Claim and Swap..`);
                const performClaim = await axios.get(
                    `http://localhost:3000/api/actions/claim?address=${address}`
                );
                if (performClaim && performClaim.data) {
                    console.log(`Claim Done`);
                    const tokenSold = requiredAvailableClaimPercentage; // swap only the 1%
                    const slippage = 3; // 3% for small amounts, change at your preference.
                    console.log(
                        `Swap Details >> tokenSold: ${tokenSold}, slippage: ${slippage}`
                    );
                    const performSwap = await axios.get(
                        `http://localhost:3000/api/actions/swap?address=${address}&slippage=${slippage}&tokenSold=${tokenSold}`
                    );
                    if (performSwap && performSwap.data) {
                        console.log(`Swap Done. ${performSwap.data.message}`);
                    }
                }
            } else {
                console.log(`Not enough BNB balance in wallet`);
            }
        }
    } else {
        console.log(`Skipping, no thresholdPercentage defined`);
    }
}

module.exports = continuousRollPercentageStrategy;
