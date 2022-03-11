import axios from 'axios';
import { useMutation } from 'react-query';
import cn from 'classnames';
import Button from './Button';
import Input from './Input';
import Modal from './partials/Modal';
import { useState } from 'react';
import { useInput } from '../hooks/input-hook';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ellipsisInBetween from '../utils/ellipsisInBetween';

export const SwapButton = (props) => {
    const defaultSlippage = 1;
    const { value: tokenSold, bind: bindTokenSold, setValue: setTokenSold } = useInput(0);
    const { value: slippage, bind: bindSlippage, setValue: setSlippage } = useInput(defaultSlippage);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { address } = props.account;

    const {
        isLoading,
        mutateAsync,
    } = useMutation(address => axios.get(`/api/actions/swap?address=${address}&slippage=${slippage}&tokenSold=${tokenSold}`), {
        // retry: false,
    });

    const notify = () => toast.promise(
        () => mutateAsync(address),
        {
            pending: {
                render() {
                    return (<div>Swapping for <strong className="break-all">{ellipsisInBetween(address)}</strong></div>)
                },
            },
            success: {
                render() {
                    return (<div>Swap successful for <strong className="break-all">{ellipsisInBetween(address)}</strong></div>)
                },
            },
            error: {
                render() {
                    return (<div>Swap failed for <strong className="break-all">{ellipsisInBetween(address)}</strong></div>)
                },
            },
        }
    )

    const closeModal = () => {
        setTokenSold(props.account.tokenBalance);
        setSlippage(defaultSlippage);
        setIsModalVisible(false);
    };

    return (
        <>
            <Button
                disabled={isLoading}
                className="table-action-button"
                onClick={() => {
                    if (props.account.tokenBalance) {
                        setTokenSold(props.account.tokenBalance);   
                    }
                    
                    setIsModalVisible(true);
                }}
            >
                Swap
            </Button>
            <Modal
                visible={isModalVisible}
                onClose={closeModal}
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
                                <div className="space-x-2 w-full">
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
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-400 text-white hover:bg-blue-500 ml-auto"
                                onClick={(e) => {
                                    e.stopPropagation();

                                    notify();
                                    closeModal();
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
