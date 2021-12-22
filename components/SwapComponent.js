// Sell DRIP for BNB

import cn from 'classnames';
import Button from './Button';
import Input from './Input';
import Modal from './Modal';
import { useState } from 'react';
import { useInput } from '../hooks/input-hook';

export const SwapComponent = (props) => {
    const { value: tokenSold, bind: bindTokenSold, setValue: setTokenSold } = useInput('');
    const { value: slippage,  bind: bindSlippage, setValue: setSlippage } = useInput(3);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [toggleRollButton, setToggleRollButton] = useState(false);

    async function swap(address, tokenSold, slippage = 3) {
        console.log('SWAP action for ', address);
        setToggleRollButton(true);

        const gasPrice = await props.web3.eth.getGasPrice();
        const nonce = await props.web3.eth.getTransactionCount(address);

        const token_sold = tokenSold;
        const dripTokenToBnbPrice = await props.fountainContract.methods
            .getTokenToBnbInputPrice(props.web3.utils.toWei(token_sold))
            .call();

        const toBN = props.web3.utils.toBN;

        const base1 = toBN(dripTokenToBnbPrice);
        const base2 = base1.mul(toBN(90)).div(toBN(100)) // TAX
        const base3 = base2.mul(toBN(100 - slippage)).div(toBN(100)) // 3% Slippage
        const min_bnb = base3.toString();

        console.log('token_sold', props.web3.utils.toWei(token_sold));
        console.log('min_bnb:', min_bnb);

        console.log('Estimate received:', props.web3.utils.fromWei(base2));
        console.log('Minimum received:', props.web3.utils.fromWei(min_bnb));

        const tx = props.fountainContract.methods.tokenToBnbSwapInput(
            props.web3.utils.toWei(token_sold),
            min_bnb
        );
        const gas = await tx.estimateGas({ from: address });
        console.log('GAS: ', gas);
        const data = tx.encodeABI();

        const txData = {
            from: address,
            to: props.fountainContractAddress,
            data,
            gas,
            gasPrice,
            nonce,
            chainId: 56,
        };

        // Commented out for testing purposes
        const receipt = await props.web3.eth.sendTransaction(txData);
        //const receipt = null;
        console.log('swap receipt:', receipt);

        if (receipt && receipt.transactionHash) {
            const transactionMined = await props.web3.eth.getTransactionReceipt(
                receipt.transactionHash
            );
            if (transactionMined) {
                console.log('swap transaction mined!');
            }
        }
        setToggleRollButton(false);
    }

    return (
        <>
            <Button
                disabled={toggleRollButton}
                className="text-xs px-2 py-1 hover:bg-gray-200"
                onClick={() => setIsModalVisible(true)}
            >
                Swap
            </Button>
            <Modal
                visible={isModalVisible}
                onClose={() => {
                    setTokenSold('');
                    setSlippage(3);
                    setIsModalVisible(false);
                }}
                title="Swap"
            >
                <div className="flex flex-col w-full pt-3 text-black space-y-5">
                    <div>
                        <small className="text-xs mb-0 pb-0">Account Name: </small>
                        <div className="font-semibold mt-0 mb-3">{props.account.accountname}</div>
                        <small className="text-xs mb-0 pb-0">Address: </small>
                        <div className="font-semibold mt-0">{props.account.address}</div>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <label htmlFor="token_sold" className="text-xs">
                            Token Sold:
                        </label>
                        <div className="relative block">
                            <Input
                                type="number"
                                id="token_sold"
                                {...bindTokenSold}
                                placeholder="Token Sold"
                                className="w-full"
                                required
                            />
                            <Button className="absolute top-2 right-3 text-xs px-2 py-1 bg-gray-100 z-50" onClick={() => setTokenSold(props.account.tokenBalance)}>Max</Button>
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="mb-2">
                            <label htmlFor="slippage" className="text-xs">
                                Slippage Tolerance: {slippage}%
                            </label>
                            <div className="w-full pt-2">
                                <div className="grid grid-cols-6 xl:grid-cols-12 gap-2 w-full">
                                    <div className="inline-block radio">
                                        <Input
                                            {...bindSlippage}
                                            name="answer"
                                            type="radio"
                                            id={`one_percent_slippage${props.account.id}`}
                                            hidden="hidden"
                                            value={1}
                                            checked={slippage === 1}
                                            onChange={() => setSlippage(1)}
                                        />
                                        <label
                                            htmlFor={`one_percent_slippage${props.account.id}`}
                                            className={cn('px-2 py-1 rounded-lg flex justify-center items-center text-xs font-semibold cursor-pointer hover:bg-gray-100 border border-gray-200', {
                                                'text-white bg-blue-400 hover:bg-blue-400 border-blue-400': slippage === 1,
                                            })}
                                        >
                                            1%
                                        </label>
                                    </div>
                                    <div className="inline-block radio">
                                        <Input
                                            {...bindSlippage}
                                            name="answer"
                                            type="radio"
                                            id={`three_percent_slippage${props.account.id}`}
                                            hidden="hidden"
                                            value={3}
                                            checked={slippage === 3}
                                            onChange={() => setSlippage(3)}
                                        />
                                        <label
                                            htmlFor={`three_percent_slippage${props.account.id}`}
                                            className={cn('px-2 py-1 rounded-lg flex justify-center items-center text-xs font-semibold cursor-pointer hover:bg-gray-100 border border-gray-200', {
                                                'text-white bg-blue-400 hover:bg-blue-400 border-blue-400': slippage === 3,
                                            })}
                                        >
                                            3%
                                        </label>
                                    </div>
                                    <div className="inline-block radio">
                                        <Input
                                            {...bindSlippage}
                                            name="answer"
                                            type="radio"
                                            id={`five_percent_slippage${props.account.id}`}
                                            hidden="hidden"
                                            value={5}
                                            checked={slippage === 5}
                                            onChange={() => setSlippage(5)}
                                        />
                                        <label
                                            htmlFor={`five_percent_slippage${props.account.id}`}
                                            className={cn('px-2 py-1 rounded-lg flex justify-center items-center text-xs font-semibold cursor-pointer hover:bg-gray-100 border border-gray-200', {
                                                'text-white bg-blue-400 hover:bg-blue-400 border-blue-400': slippage === 5,
                                            })}
                                        >
                                            5%
                                        </label>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div>
                            <Button
                                disabled={toggleRollButton}
                                className="px-4 py-2 bg-blue-400 text-white hover:bg-blue-500 ml-auto"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (
                                        window.confirm('Are you sure you wish to Swap / Sell DRIP?')
                                    ) {
                                        swap(props.account.address, tokenSold, slippage);
                                    }
                                }}
                            >
                                Swap
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};
