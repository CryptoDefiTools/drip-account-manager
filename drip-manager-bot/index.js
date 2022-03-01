const CronJob = require('cron').CronJob;
const axios = require('axios');
const continuousRollStrategy = require('./strategy/continuousRollStrategy');
const continuousRollPercentageStrategy = require('./strategy/continuousRollPercentageStrategy');
const alternatingRollClaimStrategy = require('./strategy/alternatingRollClaimStrategy');
const alternatingRollClaimSwapStrategy = require('./strategy/alternatingRollClaimSwapStrategy');
const alternatingRollClaimSwapPercentageStrategy = require('./strategy/alternatingRollClaimSwapPercentageStrategy');
const alternatingRollClaimSwapRatioPercentageStrategy = require('./strategy/alternatingRollClaimSwapRatioPercentageStrategy');
const BNB_WALLET_MIN_VALUE = 1;

async function runbot() {
    // (1) Fetch all accounts
    const getAccounts = await axios.get('http://localhost:3000/api/accounts');
    const accounts = getAccounts.data;
    //console.log(accounts);

    // (2) Iterate over all accounts
    for (account of accounts) {
        console.log(`--- START ---`);
        try {
            const { address, id } = account;
            // (3) Fetch Account Details
            const getAccountDetail = await axios.get(
                `http://localhost:3000/api/accounts/${address}`
            );
            const accountDetail = getAccountDetail.data;
            //console.log(accountDetail);
            console.log(`${address}`);
            // (4) Fetch Current Rates
            const getRates = await axios.get('http://localhost:3000/api/rates');
            if (!getRates || !getRates.data) continue;
            const { bnbDrip, bnbUsdt, bnbdripUsdt } = getRates.data;
            console.log(
                `BNB/DRIP = ${numberFormat(bnbDrip, 2)} || ` +
                    `BNB/DRIP ≈ ${numberFormat(bnbdripUsdt, 2)} USDT || ` +
                    `BNB/USDT = ${numberFormat(bnbUsdt, 2)}`
            );

            // (5) Compute Wallet BNB ballance in USD and dripBalance in USD
            const bnbBalanceInUSDT = accountDetail.bnbBalance * bnbUsdt;
            const claimsInUsdt = accountDetail.claims * bnbdripUsdt;
            console.log(`BNB balance in USDT: ${bnbBalanceInUSDT}`);
            console.log(`Claims in USDT: ${claimsInUsdt}`);
            console.log(`Account Strategy: ${accountDetail.botStrategy}`);
            switch (accountDetail.botStrategy) {
                case 'continuousRollStrategy':
                    await continuousRollStrategy(
                        address,
                        accountDetail,
                        bnbBalanceInUSDT,
                        claimsInUsdt,
                        BNB_WALLET_MIN_VALUE
                    );
                    break;
                case 'continuousRollPercentageStrategy':
                    await continuousRollPercentageStrategy(
                        address,
                        accountDetail,
                        bnbBalanceInUSDT,
                        claimsInUsdt,
                        BNB_WALLET_MIN_VALUE
                    );
                    break;
                case 'alternatingRollClaimStrategy':
                    await alternatingRollClaimStrategy(
                        address,
                        accountDetail,
                        bnbBalanceInUSDT,
                        claimsInUsdt,
                        BNB_WALLET_MIN_VALUE
                    );
                    break;
                case 'alternatingRollClaimSwapStrategy':
                    await alternatingRollClaimSwapStrategy(
                        address,
                        accountDetail,
                        bnbBalanceInUSDT,
                        claimsInUsdt,
                        BNB_WALLET_MIN_VALUE
                    );
                    break;
                case 'alternatingRollClaimSwapPercentageStrategy':
                    await alternatingRollClaimSwapPercentageStrategy(
                        address,
                        accountDetail,
                        bnbBalanceInUSDT,
                        claimsInUsdt,
                        BNB_WALLET_MIN_VALUE
                    );
                    break;
                case 'alternatingRollClaimSwapRatioPercentageStrategy':
                    await alternatingRollClaimSwapRatioPercentageStrategy(
                        address,
                        accountDetail,
                        bnbBalanceInUSDT,
                        claimsInUsdt,
                        BNB_WALLET_MIN_VALUE
                    );
                    break;
                default:
                    console.log(`No botStrategy defined`);
            }
        } catch (err) {
            // Continue iterating over the accounts in case of any errors
            console.log(err);
        }
        console.log(`--- END ---`);
    }
    // Example non-overlapping job
    //await new Promise(r => setTimeout(r, 5000));
}

const job = new CronJob({
    cronTime: '* * * * * *',
    onTick: async () => {
        if (job.taskRunning) {
            return;
        }

        job.taskRunning = true;
        try {
            await runbot();
        } catch (err) {
            // Handle error
            console.log(err);
        }
        job.taskRunning = false;
    },
    start: true,
    timeZone: 'Asia/Manila',
});

const numberFormat = (number, decimals) => {
    return parseFloat(number).toLocaleString('en-US', {
        maximumFractionDigits: decimals,
    });
};

// references
// https://www.npmjs.com/package/cron
// https://momentjs.com/timezone/
// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
// non-overlapping cron jobs https://github.com/kelektiv/node-cron/issues/347
