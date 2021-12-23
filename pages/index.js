import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery, useQueries } from 'react-query';
import Header from '../components/layouts/Header';
import PageContainer from '../components/layouts/PageContainer';
import TableLoader from '../components/placeholders/TableLoader';
import CollapsibleTableRow from '../components/CollapsibleTableRow';
import numberFormat from '../utils/numberFormat';

import Web3 from 'web3';
import getAllAccount from '../lib/account-service';

const drip_contract = require('../lib/drip-contract.json');
const fountain_contract = require('../lib/drip-fountain-contract.json');
const simple_contract = require('../lib/simple-contract.json');
const drip_token_contract = require('../lib/drip-token-contract.json');

import { AddressDetailsComponent } from '../components/AddressDetailsComponent';
import { RollComponent } from '../components/RollComponent';
import { ClaimComponent } from '../components/ClaimComponent';
import { SwapComponent } from '../components/SwapComponent';
import Donate from '../components/Donate';

function Dashboard(props) {
    const [web3, setWeb3] = useState();
    const [accounts, setAccounts] = useState([]);
    const [dripContract, setDripContract] = useState();
    const [fountainContract, setFountainContract] = useState();
    const [dripTokenContract, setDripTokenContract] = useState();
    const [bnbDripToUSDT, setBnbDripToUSDT] = useState(0);
    const [bnbDripRaw, setBnbDripRaw] = useState(0);
    const [bnbToUSDT, setBnbToUSDT] = useState(0);
    const [showFullAddress, setShowFullAddress] = useState(false);
    const [loading, setLoading] = useState(true);
    const DRIP_MAIN_CONTRACT_ADDRESS =
        '0xffe811714ab35360b67ee195ace7c10d93f89d8c';
    const DRIP_FOUNTAIN_CONTRACT_ADDRESS =
        '0x4fe59adcf621489ced2d674978132a54d432653a';
    const DRIP_TOKEN_CONTRACT_ADDRESS =
        '0x20f663CEa80FaCE82ACDFA3aAE6862d246cE0333';

    // initialize web3
    useEffect(() => {
        const BSC_NETWORK = 'https://bsc-dataseed.binance.org/';
        //const BSC_NETWORK = "https://data-seed-prebsc-1-s1.binance.org/";
        const web3 = new Web3(new Web3.providers.HttpProvider(BSC_NETWORK));

        web3.eth.net
            .isListening()
            .then(() => {
                setWeb3(web3);
                console.log(`Connected to BSC network`);
            })
            .catch((e) =>
                console.error(`Error connecting to BSC network ${e}`)
            );
    }, []);

    //initialize DRIP MAIN, DRIP FOUNTAIN, DRIP TOKEN contract
    useEffect(() => {
        if (web3) {
            setDripContract(
                new web3.eth.Contract(drip_contract, DRIP_MAIN_CONTRACT_ADDRESS)
            );

            setFountainContract(
                new web3.eth.Contract(
                    fountain_contract,
                    DRIP_FOUNTAIN_CONTRACT_ADDRESS
                )
            );

            setDripTokenContract(
                new web3.eth.Contract(
                    drip_token_contract,
                    DRIP_TOKEN_CONTRACT_ADDRESS
                )
            );
        }
    }, [web3]);

    const getUsdToBnbPrice = () =>
        axios.get(
            'https://api.coingecko.com/api/v3/simple/price?ids=wbnb&vs_currencies=usd'
        );

    useQuery('usdToBnb', getUsdToBnbPrice, {
        refetchInterval: 5000,
        onSuccess: (response) => {
            const bnbToUSD = response?.data?.wbnb?.usd;

            setBnbToUSDT(bnbToUSD);
            console.log('BNB to USD: -------> ', bnbToUSD);
        },
    });

    const getClaims = async (address) => {
        const claims = await dripContract.methods
            .claimsAvailable(address)
            .call();

        return claims ? web3.utils.fromWei(claims) : 0;
    };

    useQueries(
        accounts.map((account, index, arr) => {
            return {
                refetchInterval: 5000,
                queryKey: [`account${index}`, account.address],
                queryFn: () => getClaims(account.address),
                onSuccess: (response) => {
                    const currentAccount = {
                        ...account,
                        claims: response,
                    };

                    setAccounts([
                        ...arr.slice(0, index),
                        currentAccount,
                        ...arr.slice(index + 1),
                    ]);
                    //console.log(`${index}: ${response}`);
                },
            };
        })
    );

    // initalize conversion
    useEffect(() => {
        const loadRates = async () => {
            const dripTokenToBnbPrice = await fountainContract.methods
                .getTokenToBnbInputPrice('1000000000000000000')
                .call();
            // console.log(dripTokenToBnbPrice);
            setBnbDripRaw(web3.utils.fromWei(dripTokenToBnbPrice))

            const dripToBNB =
                web3.utils.fromWei(dripTokenToBnbPrice) * bnbToUSDT;
            // console.log('BNB/DRIP ≈ ', dripToBNB, 'USDT');
            setBnbDripToUSDT(dripToBNB);
        };

        // compute drip token to bnb price
        if (web3 && fountainContract) {
            loadRates();
        }
    }, [web3, fountainContract, bnbToUSDT, accounts, dripContract]);

    // initialize accounts & load account balance
    useEffect(() => {
        if (web3 && dripContract && dripTokenContract) {
            loadData();
        }

        async function loadData() {
            let fetched_accounts = [];
            for (const account of getAllAccount()) {
                try {
                    const accountInfo = await dripContract.methods
                        .userInfo(account.address)
                        .call();
                    const accountTotal2 = await dripContract.methods
                        .userInfoTotals(account.address)
                        .call();

                    console.log('buddy', accountInfo.upline); // buddy/upline
                    console.log('directs', accountTotal2.referrals); // directs / referrals
                    console.log('team:', accountTotal2.total_structure); // team: total_structure
                    console.log(
                        'airdrop sent',
                        web3.utils.fromWei(accountTotal2.airdrops_total)
                    ); // airdrop sent
                    console.log(
                        'airdrop received',
                        web3.utils.fromWei(accountTotal2.airdrops_received)
                    ); // airdrop received

                    // compute net deposits
                    // NET DEPOSIT VALUE = ( DEPOSITS + AIRDROPS + ROLLS ) - CLAIMS
                    const d = accountTotal2.total_deposits;
                    const a = accountTotal2.airdrops_total;
                    const c = accountTotal2.total_payouts;
                    const user = await dripContract.methods
                        .users(account.address)
                        .call();
                    const r = user.rolls;
                    const toBN = web3.utils.toBN;
                    const net_deposits = toBN(d).add(toBN(a)).add(toBN(r)).sub(toBN(c)) //d + a + r - c;
                    console.log('net deposits', web3.utils.fromWei(net_deposits.toString()));

                    const isNetPositive = await dripContract.methods
                        .isNetPositive(account.address)
                        .call();
                    console.log('isNetPositive', isNetPositive);
                    // create in-memory wallet
                    web3.eth.accounts.wallet.add(account.private);

                    const bnbBalance = web3.utils.fromWei(
                        await web3.eth.getBalance(account.address)
                    );

                    // drip token
                    const dripTokenBalance = web3.utils.fromWei(
                        await dripTokenContract.methods
                            .balanceOf(account.address)
                            .call()
                    );

                    fetched_accounts.push({
                        id: account.id,
                        accountname: account.accountname,
                        address: account.address,
                        bnb_balance: bnbBalance,
                        deposits: accountInfo.deposits,
                        // claims: claimsAvailable,
                        claims: 0,
                        tokenBalance: dripTokenBalance,
                        walletLevel: account.walletLevel,
                        rollCount: account.rollCount,

                        // User info totals
                        buddy: accountInfo.upline,
                        directs: accountTotal2.referrals,
                        directRewards: web3.utils.fromWei(accountInfo.direct_bonus),
                        indirectRewards: web3.utils.fromWei(accountInfo.match_bonus),
                        team: accountTotal2.total_structure,
                        airDropSent: web3.utils.fromWei(accountTotal2.airdrops_total),
                        airDropReceived: web3.utils.fromWei(accountTotal2.airdrops_received),
                        netDeposits: web3.utils.fromWei(net_deposits.toString()),
                        isNetPositive: isNetPositive,
                    });
                } catch (error) {
                    console.error(
                        'There is an issue with this account!',
                        error
                    );
                }
            }

            setAccounts(fetched_accounts);
            setLoading(false);
            console.log('Accounts Loaded');
        }
    }, [web3, dripContract, dripTokenContract]);

    return (
        <PageContainer>
            <Header title="DRIP Accounts Manager">
                <div className="flex space-x-5 text-sm font-semibold">
                    {/* <div>BNB/DRIP ≈ 0.11782822339208508 / ${numberFormat(bnbDripToUSDT, 2)} USDT</div> */}
                    <div>BNB/DRIP ≈ {bnbDripRaw} / ${numberFormat(bnbDripToUSDT, 2)} USDT</div>
                    <div>BNB/USDT ≈ ${numberFormat(bnbToUSDT, 2)}</div>
                </div>
            </Header>
            <div className="container px-0 xl:px-28 pt-28">
                {loading ? (
                    <TableLoader
                        headers={[
                            '#',
                            'Name',
                            'Address',
                            'BNB Balance',
                            'DRIP Balance',
                            'Deposits',
                            'Available Claim',
                            'Actions',
                            '',
                        ]}
                        rowCount={10}
                    />
                ) : (
                    <div className="table-container slim-scroll">
                        <table className="table">
                            <thead className="table-head text-xs">
                                <tr>
                                    <th className="table-header whitespace-nowrap">
                                        #
                                    </th>
                                    <th className="table-header whitespace-nowrap">
                                        Name
                                    </th>
                                    <th className="table-header whitespace-nowrap">
                                        Address <button className="text-xs text-yellow-500" title="Toggle between whole and shortened address" onClick={() => setShowFullAddress(!showFullAddress)}>({!showFullAddress ? 'Shortened' : 'Whole'})</button>
                                    </th>
                                    <th className="table-header whitespace-nowrap">
                                        BNB Balance
                                    </th>
                                    <th className="table-header whitespace-nowrap">
                                        DRIP Balance
                                    </th>
                                    <th className="table-header whitespace-nowrap">
                                        Deposits
                                    </th>
                                    <th className="table-header whitespace-nowrap">
                                        Available Claim
                                    </th>
                                    <th className="table-header whitespace-nowrap">
                                        Actions
                                    </th>
                                    <th className="table-header whitespace-nowrap"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts?.map((row, index) => {
                                    const {
                                        id,
                                        accountname,
                                        bnb_balance,
                                        tokenBalance,
                                        deposits,
                                        claims,
                                    } = row;

                                    return (
                                        <React.Fragment key={index}>
                                            <CollapsibleTableRow
                                                rowkey={id + index}
                                                rowContent={
                                                    <>
                                                        <td className="table-data">
                                                            {id}
                                                        </td>
                                                        <td className="table-data">
                                                            {accountname}
                                                        </td>
                                                        <td className="table-data">
                                                            <AddressDetailsComponent
                                                                account={row}
                                                                showFullAddress={showFullAddress}
                                                            />
                                                        </td>
                                                        <td className="table-data">
                                                            <span className="block font-semibold">
                                                                {numberFormat(
                                                                    bnb_balance,
                                                                    4
                                                                )}{' '}
                                                                BNB
                                                            </span>
                                                            <span className="block text-xs">
                                                                USD: $
                                                                {numberFormat(
                                                                    bnb_balance *
                                                                    bnbToUSDT,
                                                                    2
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="table-data">
                                                            <span className="block font-semibold">
                                                                {numberFormat(
                                                                    tokenBalance,
                                                                    4
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="table-data">
                                                            <span className="block font-semibold">
                                                                {numberFormat(
                                                                    deposits
                                                                        ? web3.utils.fromWei(
                                                                            deposits
                                                                        )
                                                                        : 0,
                                                                    3
                                                                )}
                                                            </span>
                                                            <span className="block text-xs">
                                                                USD: $
                                                                {numberFormat(
                                                                    (deposits
                                                                        ? web3.utils.fromWei(
                                                                            deposits
                                                                        )
                                                                        : 0) *
                                                                    bnbDripToUSDT,
                                                                    2
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="table-data">
                                                            <span className="block font-semibold">
                                                                {numberFormat(
                                                                    claims,
                                                                    10
                                                                )}
                                                            </span>
                                                            <span className="block text-xs">
                                                                USD: $
                                                                {numberFormat(
                                                                    claims *
                                                                    bnbDripToUSDT,
                                                                    2
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="table-data">
                                                            <div className="table-controls">
                                                                <RollComponent
                                                                    account={
                                                                        row
                                                                    }
                                                                    web3={web3}
                                                                    dripContract={
                                                                        dripContract
                                                                    }
                                                                    dripContractAddress={
                                                                        DRIP_MAIN_CONTRACT_ADDRESS
                                                                    }
                                                                />

                                                                <ClaimComponent
                                                                    account={
                                                                        row
                                                                    }
                                                                    web3={web3}
                                                                    dripContract={
                                                                        dripContract
                                                                    }
                                                                    dripContractAddress={
                                                                        DRIP_MAIN_CONTRACT_ADDRESS
                                                                    }
                                                                />

                                                                <SwapComponent
                                                                    account={
                                                                        row
                                                                    }
                                                                    web3={web3}
                                                                    fountainContract={
                                                                        fountainContract
                                                                    }
                                                                    fountainContractAddress={
                                                                        DRIP_FOUNTAIN_CONTRACT_ADDRESS
                                                                    }
                                                                />
                                                            </div>
                                                        </td>
                                                    </>
                                                }
                                                collapsibleContent={
                                                    <td
                                                        colSpan={9}
                                                        className="p-5"
                                                    >
                                                        <div className="">
                                                            <div className="flex w-full md:w-1/2">
                                                                <div className="font-bold w-1/2">Buddy</div>
                                                                <div className="w-1/2">{row.buddy}</div>
                                                            </div>
                                                            <div className="flex w-full md:w-1/2">
                                                                <div className="font-bold w-1/2">Directs / Team</div>
                                                                <div className="w-1/2">{row.directs} / {row.team}</div>
                                                            </div>
                                                            <div className="flex w-full md:w-1/2">
                                                                <div className="font-bold w-1/2">Airdrops Sent / Received</div>
                                                                <div className="w-1/2">{numberFormat(row.airDropSent, 3)} / {numberFormat(row.airDropReceived, 3)}</div>
                                                            </div>
                                                            <div className="flex w-full md:w-1/2">
                                                                <div className="font-bold w-1/2">Net Deposits</div>
                                                                <div className="w-1/2">{numberFormat(row.netDeposits, 14)}</div>
                                                            </div>
                                                            <div className="flex w-full md:w-1/2">
                                                                <div className="font-bold w-1/2">Net Positive</div>
                                                                <div className="w-1/2">{row.isNetPositive ? 'Yes' : 'No'}</div>
                                                            </div>
                                                            <div className="flex w-full md:w-1/2">
                                                                <div className="font-bold w-1/2">Rewards Direct / Indirect</div>
                                                                <div className="w-1/2">{numberFormat(row.directRewards, 3)} / {numberFormat(row.indirectRewards, 3)}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                }
                                            />
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                        <Donate/>
                    </div>
                )}
            </div>
        </PageContainer>
    );
}

export default Dashboard;
