import Web3 from 'web3';
const fountain_contract = require('../../../lib/drip-fountain-contract.json');
const DRIP_FOUNTAIN_CONTRACT_ADDRESS =
    '0x4fe59adcf621489ced2d674978132a54d432653a';
import axios from 'axios';
export default async function handler(req, res) {
    // initialize web3
    const BSC_NETWORK = 'https://bsc-dataseed.binance.org/';
    const web3 = new Web3(new Web3.providers.HttpProvider(BSC_NETWORK));

    // initialize contracts
    const fountainContract = new web3.eth.Contract(
        fountain_contract,
        DRIP_FOUNTAIN_CONTRACT_ADDRESS
    );

    const dripTokenToBnbPrice = await fountainContract.methods
        .getTokenToBnbInputPrice('1000000000000000000')
        .call();

    const bnbdrip = Number(web3.utils.fromWei(dripTokenToBnbPrice)).toFixed(16);

    const getUsdToBnbPrice = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=wbnb&vs_currencies=usd'
    );

    const bnbusd = getUsdToBnbPrice?.data?.wbnb?.usd;

    const bnbdripUSDT = Number(bnbdrip * bnbusd).toFixed(2);

    res.status(200).json({
        'bnbDrip': bnbdrip, // bnb/drip
        'bnbUsdt': bnbusd, // bnb/usdt
        'bnbdripUsdt': bnbdripUSDT, // bnb/drip ~ USDT
    });
}
