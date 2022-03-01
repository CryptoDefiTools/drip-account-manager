import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useQueries } from 'react-query';
import Header from '../components/layouts/Header';
import PageContainer from '../components/layouts/PageContainer';
import TableLoader from '../components/placeholders/TableLoader';
import CollapsibleTableRow from '../components/CollapsibleTableRow';
import numberFormat from '../utils/numberFormat';

import { AddressDetailsComponent } from '../components/AddressDetailsComponent';
import { RollButton } from '../components/RollButton';
import { ClaimButton } from '../components/ClaimButton';
import { SwapButton } from '../components/SwapButton';
import Donate from '../components/Donate';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
    const [bnbDrip, setBnbDrip] = useState(0);
    const [bnbDripToUSDT, setBnbDripToUSDT] = useState(0);
    const [bnbToUSDT, setBnbToUSDT] = useState(0);
    const [accounts, setAccounts] = useState([]);

    const [showFullAddress, setShowFullAddress] = useState(false);

    const autoRefreshInterval = 3000;

    const getRates = () => axios.get('/api/rates');
    const getAccounts = () => axios.get('/api/accounts');
    const getInfo = address => axios.get(`/api/accounts/${address}`);

    useQuery('rates', getRates, {
        refetchInterval: autoRefreshInterval,
        onSuccess: response => {
            const { bnbDrip, bnbUsdt, bnbdripUsdt } = response.data;

            setBnbDrip(bnbDrip);
            setBnbDripToUSDT(bnbdripUsdt);
            setBnbToUSDT(bnbUsdt);
        },
    });

    const { isLoading } = useQuery('accounts', getAccounts, {
        refetchOnWindowFocus: false,
        onSuccess: response => setAccounts(response.data),
    });

    useQueries(
        accounts.map((account, index, arr) => {
            return {
                refetchInterval: autoRefreshInterval,
                queryKey: [`account${index}`, account.address],
                queryFn: () => getInfo(account.address),
                onSuccess: response => {
                    const currentAccount = {
                        ...account,
                        ...response.data,
                    };

                    setAccounts([
                        ...arr.slice(0, index),
                        currentAccount,
                        ...arr.slice(index + 1),
                    ]);
                },
            };
        })
    );

    return (
        <PageContainer>
            <ToastContainer />
            <Header title="DRIP Accounts Manager">
                <div className="flex flex-col lg:flex-row lg:space-x-5 text-xs lg:text-sm font-semibold">
                    <div>{numberFormat(bnbDrip, 18)} BNB/DRIP</div>
                    <div>BNB/DRIP ≈ ${numberFormat(bnbDripToUSDT, 2)} USDT</div>
                    <div>BNB/USDT ≈ ${numberFormat(bnbToUSDT, 2)}</div>
                </div>
            </Header>
            <div className="container px-0 xl:px-28 pt-28">
                {isLoading ? (
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
                                    <th className="table-header">#</th>
                                    <th className="table-header">Name</th>
                                    <th className="table-header">
                                        Address 
                                        <button 
                                            className="text-xs text-yellow-500 ml-1" 
                                            title="Toggle between whole and shortened address" 
                                            onClick={() => setShowFullAddress(!showFullAddress)}
                                        >
                                            ({!showFullAddress ? 'Shortened' : 'Whole'})
                                        </button>
                                    </th>
                                    <th className="table-header">BNB Balance</th>
                                    <th className="table-header">DRIP Balance</th>
                                    <th className="table-header">Deposits</th>
                                    <th className="table-header">Available Claim</th>
                                    <th className="table-header">Actions</th>
                                    <th className="table-header"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    accounts?.map((account, index) => {
                                        const {
                                            // Row details
                                            id,
                                            accountName,
                                            bnbBalance = 0,
                                            tokenBalance = 0,
                                            deposits = 0,
                                            claims = 0,
                                            // Collapsible details
                                            buddy = 0,
                                            directs = 0,
                                            team = 0,
                                            airDropSent = 0,
                                            airDropReceived = 0,
                                            netDeposits = 0,
                                            isNetPositive,
                                            directRewards = 0,
                                            indirectRewards = 0,
                                        } = account;

                                        const bnbBalanceFormatted = `${numberFormat(bnbBalance, 4)} BNB`;
                                        const bnbBalanceInUsd = `USD: $${numberFormat(bnbBalance * bnbToUSDT, 2)}`;
                                        const tokenBalanceFormatted = numberFormat(tokenBalance, 4);
                                        const depositsFormatted = numberFormat(deposits, 3);
                                        const depositsInUsdt = `USD: $${numberFormat(deposits * bnbDripToUSDT, 2)}`;
                                        const claimsFormatted = numberFormat(claims, 10);
                                        const claimsInUsdt = `USD: $${numberFormat(claims * bnbDripToUSDT, 2)}`;

                                        return (
                                            <React.Fragment key={index}>
                                                <CollapsibleTableRow
                                                    rowkey={id + index}
                                                    rowContent={
                                                        <>
                                                            <td className="table-data">{id}</td>
                                                            <td className="table-data">{accountName}</td>
                                                            <td className="table-data">
                                                                <AddressDetailsComponent
                                                                    account={account}
                                                                    showFullAddress={showFullAddress}
                                                                />
                                                            </td>
                                                            <td className="table-data">
                                                                <span className="block font-semibold">{bnbBalanceFormatted}</span>
                                                                <span className="block text-xs">{bnbBalanceInUsd}</span>
                                                            </td>
                                                            <td className="table-data">
                                                                <span className="block font-semibold">{tokenBalanceFormatted}</span>
                                                            </td>
                                                            <td className="table-data">
                                                                <span className="block font-semibold">{depositsFormatted}</span>
                                                                <span className="block text-xs">{depositsInUsdt}</span>
                                                            </td>
                                                            <td className="table-data">
                                                                <span className="block font-semibold">{claimsFormatted}</span>
                                                                <span className="block text-xs">{claimsInUsdt}</span>
                                                            </td>
                                                            <td className="table-data">
                                                                <div className="table-controls">
                                                                    <RollButton account={account}/>
                                                                    <ClaimButton account={account}/>
                                                                    <SwapButton account={account}/>
                                                                </div>
                                                            </td>
                                                        </>
                                                    }
                                                    collapsibleContent={
                                                        <td colSpan={9} className="p-5">
                                                            <div className="flex w-full md:w-1/2">
                                                                <div className="font-bold w-1/2">Buddy</div>
                                                                <div className="w-1/2">{buddy}</div>
                                                            </div>
                                                            <div className="flex w-full md:w-1/2">
                                                                <div className="font-bold w-1/2">Directs / Team</div>
                                                                <div className="w-1/2">{directs} / {team}</div>
                                                            </div>
                                                            <div className="flex w-full md:w-1/2">
                                                                <div className="font-bold w-1/2">Airdrops Sent / Received</div>
                                                                <div className="w-1/2">{numberFormat(airDropSent, 3)} / {numberFormat(airDropReceived, 3)}</div>
                                                            </div>
                                                            <div className="flex w-full md:w-1/2">
                                                                <div className="font-bold w-1/2">Net Deposits</div>
                                                                <div className="w-1/2">{numberFormat(netDeposits, 14)}</div>
                                                            </div>
                                                            <div className="flex w-full md:w-1/2">
                                                                <div className="font-bold w-1/2">Net Positive</div>
                                                                <div className="w-1/2">{isNetPositive ? 'Yes' : 'No'}</div>
                                                            </div>
                                                            <div className="flex w-full md:w-1/2">
                                                                <div className="font-bold w-1/2">Rewards Direct / Indirect</div>
                                                                <div className="w-1/2">{numberFormat(directRewards, 3)} / {numberFormat(indirectRewards, 3)}</div>
                                                            </div>
                                                        </td>
                                                    }
                                                />
                                            </React.Fragment>
                                        );
                                    })
                                }
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
